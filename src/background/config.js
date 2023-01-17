import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'

export default class Config {
  async processPortMessage({ href, frameElement }) {
    const { configs = [] } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS)
    let result
    let fullMatch = false
    configs.forEach(config => {
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
      chrome.action.setIcon({ path: 'assets/icons/icon64.png' })
      return { ...result }
    }

    if (!frameElement) {
      chrome.action.setIcon({ path: 'assets/icons/icon_black64.png' })
      Logger.colorInfo(`No configs Found ${href}`)
    }
    return null
  }

  urlMatcher(url, href) {
    return new RegExp(this.escape(url)).test(href) || href.indexOf(url) !== -1
  }

  escape(url) {
    return url.replace(/[?]/g, '\\$&')
  }
}
