import { Tabs } from '@dhruv-techapps/core-extension'
import { LocalStorage, Logger } from '@dhruv-techapps/core-common'

const LOCAL_STORAGE_VERSION = 'version'
export class Blog {
  static async check(optionsPageUrl) {
    Logger.log('Bolog Check')
    fetch('https://blog.getautoclicker.com/')
      .then(response => response.text())
      .then(response => {
        // Parse the text
        const doc = new DOMParser().parseFromString(response, 'text/html')
        const version = doc.querySelector('.post-title a').href.split('/')[3]
        const currentVersion = LocalStorage.getItem(LOCAL_STORAGE_VERSION, '')
        if (currentVersion !== version) {
          Blog.show(optionsPageUrl, version)
        }
      })
  }

  static async show(optionsPageUrl, version) {
    Tabs.create({ properties: { url: `${optionsPageUrl}?version=${version}` } })
    LocalStorage.setItem(LOCAL_STORAGE_VERSION, version)
  }
}
