import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
// import { GoogleAnalytics } from '@dhruv-techapps/core-extension'

export default class DiscordMessaging {
  async processPortMessage({ notification: { title, fields, color } }) {
    try {
      const { settings } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS)
      if (settings) {
        const {
          notifications: { discord }
        } = settings
        if (discord) {
          fetch(chrome.runtime.getURL('configuration.json'))
            .then(r => r.json())
            .then(async ({ functions: functionURL, variant }) => {
              const url = new URL(`${functionURL}/notifyDiscord`)
              const { uid } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.DISCORD)
              url.searchParams.append('title', title)
              url.searchParams.append('id', uid)
              url.searchParams.append('fields', JSON.stringify(fields))
              url.searchParams.append('variant', variant)
              url.searchParams.append('color', color)
              fetch(url)
                .then(Logger.colorInfo)
                .catch(error => {
                  Logger.colorError(error)
                  // GoogleAnalytics.error({ error }, () => {})
                })
            })
        }
      }
    } catch (error) {
      Logger.colorError(error)
      return error
      // GoogleAnalytics.error({ error }, () => {})
    }
    return {}
  }
}
