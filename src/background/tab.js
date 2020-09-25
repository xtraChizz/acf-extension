import { Tabs } from '@dhruv-techapps/core-extension'

export let optionsTab

chrome.tabs.onRemoved.addListener((tabId) => {
  if (optionsTab && optionsTab.id === tabId) {
    optionsTab = undefined
  }
})

export class TabsMessenger {
  static optionsTab (properties) {
    if (optionsTab) {
      Tabs.update({ tabId: optionsTab.id, properties: { ...properties, active: true } })
    } else {
      Tabs.create({ properties }, tab => { optionsTab = tab })
    }
  }
}
