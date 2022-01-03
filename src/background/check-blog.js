import { Tabs } from '@dhruv-techapps/core-extension'

export class Blog {
  static async check(optionsPageUrl, version) {
    const response = await fetch(`https://blog.getautoclicker.com/${version}/`)
    if (response.status === 200) {
      Tabs.create({ properties: { url: `${optionsPageUrl}?version=${version}` } })
    }
  }
}
