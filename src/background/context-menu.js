import { ACTION_POPUP, CONTEXT_MENU_CONFIG_PAGE_ID } from '../common/constant'

export default function registerContextMenus(optionsPageUrl) {
  chrome.contextMenus.removeAll()
  chrome.contextMenus.create({ id: ACTION_POPUP, title: '☉ Auto Clicker (Record)', contexts: ['all'] })
  chrome.contextMenus.create({ id: 'SEPARATOR', type: 'separator', contexts: ['all'] })
  chrome.contextMenus.create({ id: CONTEXT_MENU_CONFIG_PAGE_ID, title: 'Open Configuration Page', contexts: ['all'] })

  chrome.contextMenus.onClicked.addListener(async ({ menuItemId }, tab) => {
    if (menuItemId === CONTEXT_MENU_CONFIG_PAGE_ID) {
      chrome.tabs.create({ url: optionsPageUrl })
    } else if (menuItemId === ACTION_POPUP) {
      chrome.tabs.sendMessage(tab.id, { action: ACTION_POPUP })
    }
  })
}
