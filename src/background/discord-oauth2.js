import { LOCAL_STORAGE_KEY, RESPONSE_CODE } from '@dhruv-techapps/acf-common'
import { CHROME } from '@dhruv-techapps/core-common'
import { DISCORD_CLIENT_ID } from '../common/environments'
import { getRandomValues } from './util'

export const NOTIFICATIONS_TITLE = 'Discord Authentication'

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
        this.notify(NOTIFICATIONS_TITLE, chrome.runtime.lastError || responseUrl)
        return RESPONSE_CODE.ERROR
      }
      const response = await this.getCurrentUser(responseUrl.match(/token=(.+?)&/)[1])
      chrome.storage.local.set({ [LOCAL_STORAGE_KEY.DISCORD]: response })
      return response
    } catch (error) {
      this.notify(NOTIFICATIONS_TITLE, error.message)
      return RESPONSE_CODE.ERROR
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
    chrome.notifications.create('discord', { ...defaultOptions })
  }

  async getCurrentUser(token) {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.json()
  }
}
