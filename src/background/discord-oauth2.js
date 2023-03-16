import { LOCAL_STORAGE_KEY, RESPONSE_CODE } from '@dhruv-techapps/acf-common'
import { DISCORD_CLIENT_ID } from '../common/environments'
import { NotificationHandler } from './notifications'
import { getRandomValues } from './util'

const NOTIFICATIONS_TITLE = 'Discord Authentication'
const NOTIFICATIONS_ID = 'discord'

export default class DiscordOauth2 {
  async processPortMessage({ login, remove }) {
    let response
    if (remove) {
      response = await this.remove()
    }
    if (login) {
      response = await this.login()
    }
    return response
  }

  async remove() {
    await chrome.storage.local.remove(LOCAL_STORAGE_KEY.DISCORD)
    return RESPONSE_CODE.REMOVED
  }

  async login() {
    try {
      const redirectURL = chrome.identity.getRedirectURL()
      const clientID = DISCORD_CLIENT_ID
      const scopes = ['identify']

      let url = 'https://discord.com/api/oauth2/authorize'
      url += `?client_id=${clientID}`
      url += `&response_type=token`
      url += `&redirect_uri=${encodeURIComponent(redirectURL)}`
      url += `&scope=${encodeURIComponent(scopes.join(' '))}`
      url += `&nonce=${encodeURIComponent(getRandomValues())}`
      const responseUrl = await chrome.identity.launchWebAuthFlow({ url, interactive: true })
      if (chrome.runtime.lastError || responseUrl.includes('access_denied')) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, chrome.runtime.lastError || responseUrl)
        return RESPONSE_CODE.ERROR
      }
      return await this.getCurrentUser(responseUrl.match(/token=(.+?)&/)[1])
    } catch (error) {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message)
      return RESPONSE_CODE.ERROR
    }
  }

  async getCurrentUser(token) {
    let response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    response = await response.json()
    chrome.storage.local.set({ [LOCAL_STORAGE_KEY.DISCORD]: response })
    return response
  }
}
