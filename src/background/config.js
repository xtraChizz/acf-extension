import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { LocalStorage, Logger } from '@dhruv-techapps/core-common'
import { BrowserAction } from '@dhruv-techapps/core-extension'

export default class Config {
  processPortMessage({ href, frameElement }) {
    const data = LocalStorage.getItem(LOCAL_STORAGE_KEY.CONFIGS)
    let result
    let fullMatch = false
    data.forEach(config => {
      if (config && typeof config === 'object' && !Array.isArray(config)) {
        if (config.enable && config.url) {
          if (!result && this.urlMatcher(config.url, href)) {
            result = config
          }
          if (!fullMatch && config.url === href) {
            result = config
            fullMatch = true
          }
        }
      }
    })
    if (result) {
      BrowserAction.setIcon({ path: 'assets/icons/icon64.png' }, () => {})
      return { result }
    }

    if (!frameElement) {
      BrowserAction.setIcon({ path: 'assets/icons/icon_black64.png' }, () => {})
      Logger.log(`No configs Found ${href}`)
    }
    return {}
  }

  urlMatcher(url, href) {
    return new RegExp(this.escape(url)).test(href) || href.indexOf(url) !== -1
  }

  escape(url) {
    return url.replace(/[?]/g, '\\$&')
  }
}
