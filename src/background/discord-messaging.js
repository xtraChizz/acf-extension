import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { LocalStorage, Logger, Manifest } from '@dhruv-techapps/core-common'
import { GoogleAnalytics } from '@dhruv-techapps/core-extension'

export default class DiscordMessaging {
  processPortMessage({ notification: { title, fields, color } }) {
    try {
      const settings = LocalStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS)
      if (settings) {
        const {
          notifications: { discord }
        } = settings
        if (discord) {
          const { 'config.functions': functionURL, 'config.variant': variant } = Manifest.values(['config.functions', 'config.variant'])
          const url = new URL(`${functionURL}/notifyDiscord`)
          url.searchParams.append('title', title)
          url.searchParams.append('id', LocalStorage.getItem(LOCAL_STORAGE_KEY.DISCORD).uid)
          url.searchParams.append('fields', JSON.stringify(fields))
          url.searchParams.append('variant', variant)
          url.searchParams.append('color', color)
          fetch(url)
            .then(Logger.log)
            .catch(error => {
              Logger.error(error)
              GoogleAnalytics.error({ error }, () => {})
            })
        }
      }

      return {}
    } catch (error) {
      Logger.error(error)
      GoogleAnalytics.error({ error }, () => {})
    }
    return false
  }
}
