import { AUTO_BACKUP, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { CHROME } from '@dhruv-techapps/core-common'

const BACKUP_ALARM = 'backupAlarm'
const BACKUP_FILE_NAMES = {
  CONFIGS: `${LOCAL_STORAGE_KEY.CONFIGS}.txt`,
  SETTINGS: `${LOCAL_STORAGE_KEY.SETTINGS}.txt`
}
const MINUTES_IN_DAY = 1440

/* eslint-disable no-console */
export default class Backup {
  async processPortMessage({ autoBackup, restore }) {
    if (restore) {
      this.restore()
    } else if (autoBackup) {
      this.setAlarm(autoBackup)
    } else {
      this.backup(true)
    }
  }

  async getHeaders() {
    if (!this.ACCESS_TOKEN) {
      const { token } = await chrome.identity.getAuthToken({ interactive: true })
      this.ACCESS_TOKEN = token
    }
    return new Headers({ Authorization: `Bearer ${this.ACCESS_TOKEN}` })
  }

  async setAlarm(autoBackup) {
    const alarmInfo = { when: Date.now() + 500 }
    await chrome.alarms.clear(BACKUP_ALARM)
    switch (autoBackup) {
      case AUTO_BACKUP.DAILY:
        alarmInfo.periodInMinutes = MINUTES_IN_DAY
        break
      case AUTO_BACKUP.WEEKLY:
        alarmInfo.periodInMinutes = MINUTES_IN_DAY * 7
        break
      case AUTO_BACKUP.MONTHLY:
        alarmInfo.periodInMinutes = MINUTES_IN_DAY * 30
        break
      case AUTO_BACKUP.OFF:
        this.notify('Configuration Backup', 'Auto backup off', false)
        return
      default:
        break
    }
    this.notify('Configuration Backup', `Auto backup set ${autoBackup}`, false)
    chrome.alarms.create(BACKUP_ALARM, alarmInfo)
  }

  async backup(now) {
    const { configs } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS)
    if (configs) {
      const { settings } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS)
      const files = await this.list()
      const fileIds = files.reduce((a, file) => ({ ...a, [file.name]: file.id }), {})
      const { error } = await this.createOrUpdate(BACKUP_FILE_NAMES.CONFIGS, configs, fileIds[BACKUP_FILE_NAMES.CONFIGS])
      if (error) {
        this.notify('Configuration Backup Error', error.message)
      } else {
        await this.createOrUpdate(BACKUP_FILE_NAMES.SETTINGS, settings, fileIds[BACKUP_FILE_NAMES.SETTINGS])
        settings.backup.lastBackup = new Date().toLocaleString()
        chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: settings })
        if (now) {
          this.notify('Configurations Backup', `Configurations are backup on Google Drive at ${settings.backup.lastBackup}`)
        }
      }
    }
  }

  async notify(title, message, requireInteraction = true) {
    const { action } = await chrome.runtime.getManifest()
    const defaultOptions = {
      type: CHROME.NOTIFICATIONS_OPTIONS.TYPE.BASIC,
      iconUrl: action.default_icon,
      title,
      message,
      requireInteraction,
      silent: false
    }
    chrome.notifications.create('backup', { ...defaultOptions })
  }

  async restore() {
    const files = await this.list()
    if (files.length === 0) {
      this.notify('Configuration Restore', 'No configurations found on google drive for your account')
    } else {
      files.forEach(async file => {
        const fileContent = await this.get(file.id)
        if (fileContent) {
          if (file.name === BACKUP_FILE_NAMES.SETTINGS) {
            chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: fileContent })
          }
          if (file.name === BACKUP_FILE_NAMES.CONFIGS) {
            chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: fileContent })
            this.notify('Configurations Restored', 'Configurations are restored from Google Drive. Refresh configurations page to load content.')
          }
        }
      })
    }
  }

  async createOrUpdate(name, data, fileId) {
    const metadata = {
      name,
      mimeType: 'plain/text',
      ...(!fileId && { parents: ['appDataFolder'] })
    }

    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
    form.append('file', new Blob([JSON.stringify(data)], { type: 'plain/text' }))

    const headers = await this.getHeaders()
    const options = {
      headers,
      method: fileId ? 'PATCH' : 'POST',
      body: form
    }

    const baseUrl = 'https://www.googleapis.com'
    let url = new URL('upload/drive/v3/files', baseUrl)
    if (fileId) {
      url = new URL(`upload/drive/v3/files/${fileId}`, baseUrl)
    }
    url.searchParams.append('uploadType', 'multipart')
    const result = await fetch(url.href, options)
    const config = await result.json()
    return config
  }

  async list() {
    const headers = await this.getHeaders()
    const result = await fetch('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id%2C%20name)&pageSize=10', { headers })
    const { files } = await result.json()
    return files
  }

  async get(fileId) {
    const headers = await this.getHeaders()
    const result = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers })
    const file = await result.json()
    return file
  }
}

/**
 * Alarm which periodically backup configurations
 */
chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === BACKUP_ALARM) {
    new Backup().backup()
  }
})
