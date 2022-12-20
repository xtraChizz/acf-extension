import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { CONTEXT_MENU_CONFIG_PAGE_ID, CONTEXT_MENU_ELEMENT_ID, CONTEXT_MENU_FORM_ID } from '../common/constant'

export default function registerContextMenus(optionsPageUrl) {
  chrome.contextMenus.removeAll()
  chrome.contextMenus.create({ id: CONTEXT_MENU_FORM_ID, title: 'Configure for this Page (Record)', contexts: ['all'] })
  chrome.contextMenus.create({ id: CONTEXT_MENU_ELEMENT_ID, title: 'Configure for this Field', contexts: ['all'] })
  chrome.contextMenus.create({ id: 'SEPARATOR', type: 'separator', contexts: ['all'] })
  chrome.contextMenus.create({ id: CONTEXT_MENU_CONFIG_PAGE_ID, title: 'Open Configuration Page', contexts: ['all'] })

  chrome.contextMenus.onClicked.addListener(async ({ menuItemId }) => {
    if (menuItemId === CONTEXT_MENU_FORM_ID) {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      chrome.tabs.sendMessage(tabs[0].id, { action: menuItemId })
    } else if (menuItemId === CONTEXT_MENU_ELEMENT_ID) {
      const { url, xpath } = await chrome.storage.local.get([LOCAL_STORAGE_KEY.URL, LOCAL_STORAGE_KEY.XPATH])
      chrome.tabs.create({ url: `${optionsPageUrl}?url=${encodeURIComponent(url)}&elementFinder=${encodeURIComponent(xpath)}` })
      chrome.storage.local.remove([LOCAL_STORAGE_KEY.XPATH, LOCAL_STORAGE_KEY.URL])
    } else if (menuItemId === CONTEXT_MENU_CONFIG_PAGE_ID) {
      chrome.tabs.create({ url: optionsPageUrl })
    }
  })
}
