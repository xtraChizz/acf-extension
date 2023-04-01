import { GOOGLE_SCOPES, GOOGLE_SCOPES_KEY, LOCAL_STORAGE_KEY, RESPONSE_CODE } from '@dhruv-techapps/acf-common'
import GoogleOauth2 from './google-oauth2'
import { NotificationHandler } from './notifications'

const NOTIFICATIONS_TITLE = 'Google Sheets'
const NOTIFICATIONS_ID = 'sheets'

export default class GoogleSheets {
  async processPortMessage({ login, remove, spreadsheetId, ranges }) {
    let response
    if (login) {
      response = await this.login()
    } else if (remove) {
      response = await this.remove()
    } else if (!spreadsheetId || !ranges) {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'spreadsheetId or ranges is not defined')
      response = RESPONSE_CODE.ERROR
    } else {
      response = await this.getValues({ spreadsheetId, ranges })
    }
    return response
  }

  async login() {
    try {
      await GoogleOauth2.addScope(GOOGLE_SCOPES[GOOGLE_SCOPES_KEY.PROFILE])
      await GoogleOauth2.addScope(GOOGLE_SCOPES[GOOGLE_SCOPES_KEY.SHEETS])
      const headers = await GoogleOauth2.getHeaders()
      return await this.getCurrentUser(headers)
    } catch (error) {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message)
      await GoogleOauth2.removeCachedAuthToken()
      return RESPONSE_CODE.ERROR
    }
  }

  async getCurrentUser(headers) {
    let response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, { headers })
    response = await response.json()
    chrome.storage.local.set({ [LOCAL_STORAGE_KEY.GOOGLE]: response })
    return response
  }

  async remove() {
    await GoogleOauth2.removeCachedAuthToken()
    await chrome.storage.local.remove(LOCAL_STORAGE_KEY.GOOGLE)
    return RESPONSE_CODE.REMOVED
  }

  async checkUser() {
    const { [LOCAL_STORAGE_KEY.GOOGLE]: user } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.GOOGLE)
    return user
  }

  async getValues({ spreadsheetId, ranges }) {
    const user = await this.checkUser()
    if (!user) {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Login into Google Sheets from Global Settings')
      return null
    }
    try {
      const headers = await GoogleOauth2.getHeaders()
      const response = await Promise.all(ranges.map(range => fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, { headers }).then(r => r.json())))
      return response.filter(result => {
        if (result.error) {
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, result.error.message)
          return false
        }
        return true
      })
    } catch (error) {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.messag)
      await GoogleOauth2.removeCachedAuthToken()
      return RESPONSE_CODE.ERROR
    }
  }
}
