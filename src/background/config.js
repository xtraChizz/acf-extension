import { LocalStorage, Logger } from '@dhruv-techapps/core-common'
import { BrowserAction } from '@dhruv-techapps/core-extension'

export default class Config {
  processPortMessage ({ href, frameElement }) {
    try {
      const data = LocalStorage.getItem('configs')
      for (const index in data) {
        const config = data[index]
        if (config && typeof config === 'object' && !Array.isArray(config)) {
          if (config.enable && config.url && this._urlMatcher(config.url, href)) {
            BrowserAction.setIcon({ path: 'assets/icons/icon64.png' })
            const sheets = LocalStorage.getItem('sheets')
            return { config, sheets }
          }
        }
      }
    } catch (error) {
      Logger.error(error)
    }

    if (!frameElement) {
      BrowserAction.setIcon({ path: 'assets/icons/icon64.png' })
    }

    Logger.log(`No configs Found ${URL}`)
    return null
  }

  _urlMatcher (url, href) {
    return url === href || new RegExp(this._escape(url)).test(href) || href.indexOf(url) !== -1
  }

  _escape (url) {
    return url.replace(/[?]/g, '\\$&')
  }
}
