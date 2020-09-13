import { LocalStorage, Logger, BrowserAction } from '@dhruv-techapps/core-extension'

export default class Config {
  processPortMessage ({ URL, frameElement }) {
    try {
      const data = LocalStorage.getItem('configs')
      const sheets = LocalStorage.getItem('sheets')
      for (const index in data) {
        const record = data[index]
        if (record && typeof record === 'object' && !Array.isArray(record)) {
          if (record.enable && record.url && (record.url === URL || new RegExp(this.escape(record.url)).test(URL) || URL.indexOf(record.url) !== -1)) {
            BrowserAction.setIcon({ path: 'assets/icons/icon64.png' })
            return Promise.resolve({ record, sheets })
          }
        }
      }
    } catch (error) {
      Logger.error(error)
    }

    if (!frameElement) {
      BrowserAction.setIcon({ path: 'assets/icons/icon64.png' })
    }

    Logger.log(`No Records Found ${URL}`)
    return Promise.resolve()
  }

  escape (url) {
    return url.replace(/[?]/g, '\\$&')
  }
}
