import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { LocalStorage } from '@dhruv-techapps/core-common'
import { CONTEXT_MENU_CONFIG_PAGE_ID, CONTEXT_MENU_ELEMENT_ID, CONTEXT_MENU_FORM_ID } from '../common/constant'
import { TabsMessenger } from './tab'

export default function registerContextMenus(optionsPageUrl) {
  // eslint-disable-next-line no-new
  chrome.contextMenus.create({ id: CONTEXT_MENU_ELEMENT_ID, title: 'Configure for this Field', contexts: ['all'] })
  chrome.contextMenus.create({ id: CONTEXT_MENU_FORM_ID, title: 'Configure for this Page', contexts: ['all'] })
  chrome.contextMenus.create({ id: 'SEPARATOR', type: 'separator', contexts: ['all'] })
  chrome.contextMenus.create({ id: CONTEXT_MENU_CONFIG_PAGE_ID, title: 'Open Configuration Page', contexts: ['all'] })

  chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
    if (menuItemId === CONTEXT_MENU_FORM_ID) {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: menuItemId })
      })
    } else if (menuItemId === CONTEXT_MENU_ELEMENT_ID) {
      const url = `${optionsPageUrl}?url=${encodeURIComponent(LocalStorage.getItem(LOCAL_STORAGE_KEY.URL))}&elementFinder=${encodeURIComponent(LocalStorage.getItem(LOCAL_STORAGE_KEY.XPATH))}`
      TabsMessenger.optionsTab({ url })
      LocalStorage.removeItem(LOCAL_STORAGE_KEY.XPATH)
      LocalStorage.removeItem(LOCAL_STORAGE_KEY.URL)
    } else if (menuItemId === CONTEXT_MENU_CONFIG_PAGE_ID) {
      TabsMessenger.optionsTab({ url: optionsPageUrl })
    }
  })
}
