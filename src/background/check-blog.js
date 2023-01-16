import { TabsMessenger } from './tab'

const LOCAL_STORAGE_VERSION = 'version'
export class Blog {
  static async check(optionsPageUrl) {
    fetch('https://blog.getautoclicker.com/index.xml')
      .then(response => response.text())
      .then(async response => {
        const version = /\d+\.\d+\.\d+/.exec(response)[0]
        const { version: storageVersion } = await chrome.storage.local.get(LOCAL_STORAGE_VERSION)
        if (storageVersion === undefined) {
          Blog.update(version)
        } else if (storageVersion !== version) {
          Blog.show(optionsPageUrl, version)
          Blog.update(version)
        }
      })
  }

  static show(optionsPageUrl, version) {
    TabsMessenger.optionsTab({ url: `${optionsPageUrl}?version=${version}` })
  }

  static update(version) {
    chrome.storage.local.set({ [LOCAL_STORAGE_VERSION]: version })
  }
}
