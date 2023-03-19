import { AUTO_BACKUP, GOOGLE_SCOPES, GOOGLE_SCOPES_KEY, LOCAL_STORAGE_KEY, defaultConfig, defaultSettings } from '@dhruv-techapps/acf-common'
import GoogleOauth2 from './google-oauth2'
import { NotificationHandler } from './notifications'

const BACKUP_ALARM = 'backupAlarm'
const BACKUP_FILE_NAMES = {
  CONFIGS: `${LOCAL_STORAGE_KEY.CONFIGS}.txt`,
  SETTINGS: `${LOCAL_STORAGE_KEY.SETTINGS}.txt`
}
const MINUTES_IN_DAY = 1440

const NOTIFICATIONS_TITLE = 'Google Drive Backup'
const NOTIFICATIONS_ID = 'sheets'

export default class GoogleBackup {
  async processPortMessage({ autoBackup, restore }) {
    if (restore) {
      this.restore()
    } else if (autoBackup) {
      this.setAlarm(autoBackup)
    } else {
      this.backup(true)
    }
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
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Auto backup off', false)
        return
      default:
        break
    }
    NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, `Auto backup set ${autoBackup}`, false)
    chrome.alarms.create(BACKUP_ALARM, alarmInfo)
  }

  async checkInvalidCredentials(message) {
    if (message === 'Invalid Credentials' || message.includes('invalid authentication credentials')) {
      await GoogleOauth2.removeCachedAuthToken()
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Token expired reauthenticate!')
      return true
    }
    NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, message)
    return false
  }

  async backup(now) {
    try {
      const { configs = [{ ...defaultConfig }] } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS)
      if (configs) {
        const { settings = { ...defaultSettings } } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS)
        const { files } = await this.list()
        const fileIds = files.reduce((a, file) => ({ ...a, [file.name]: file.id }), {})
        await this.createOrUpdate(BACKUP_FILE_NAMES.CONFIGS, configs, fileIds[BACKUP_FILE_NAMES.CONFIGS])
        await this.createOrUpdate(BACKUP_FILE_NAMES.SETTINGS, settings, fileIds[BACKUP_FILE_NAMES.SETTINGS])
        if (!settings.backup) {
          settings.backup = {}
        }
        settings.backup.lastBackup = new Date().toLocaleString()
        chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: settings })
        if (now) {
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, `Configurations are backup on Google Drive at ${settings.backup.lastBackup}`)
        }
      }
    } catch ({ message }) {
      const retry = await this.checkInvalidCredentials(message)
      if (retry) {
        this.backup(now)
      }
    }
  }

  async restore() {
    try {
      const { files } = await this.list()
      if (files.length === 0) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'No configurations found on google drive for your account')
      } else {
        files.forEach(async file => {
          const fileContent = await this.get(file.id)
          if (fileContent) {
            if (file.name === BACKUP_FILE_NAMES.SETTINGS) {
              chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: fileContent })
            }
            if (file.name === BACKUP_FILE_NAMES.CONFIGS) {
              chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: fileContent })
              NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Configurations are restored from Google Drive. Refresh configurations page to load content.')
            }
          }
        })
      }
    } catch ({ message }) {
      const retry = await this.checkInvalidCredentials(message)
      if (retry) {
        this.restore()
      }
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

    const headers = await GoogleOauth2.getHeaders()
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
    await GoogleOauth2.addScope(GOOGLE_SCOPES[GOOGLE_SCOPES_KEY.DRIVE])
    const headers = await GoogleOauth2.getHeaders()
    const response = await fetch('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id%2C%20name)&pageSize=10', { headers })
    if (response.status === 401) {
      const { error } = await response.json()
      throw new Error(error.message)
    }
    const result = await response.json()
    return result
  }

  async get(fileId) {
    const headers = await GoogleOauth2.getHeaders()
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
    new GoogleBackup().backup()
  }
})
