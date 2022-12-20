let optionsTab

chrome.tabs.onRemoved.addListener(tabId => {
  if (optionsTab && optionsTab.id === tabId) {
    optionsTab = undefined
  }
})

export class TabsMessenger {
  static optionsTab(properties) {
    if (optionsTab) {
      chrome.tabs.update(optionsTab.id, { ...properties, active: true })
    } else {
      chrome.tabs.create(properties, tab => {
        optionsTab = tab
      })
    }
  }
}
