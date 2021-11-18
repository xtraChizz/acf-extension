import { CONTEXT_MENU_ID } from '../common/constant'

export default function registerContextMenus(title) {
  // eslint-disable-next-line no-new
  chrome.contextMenus.create({ id: CONTEXT_MENU_ID, title, contexts: ['all'] })

  chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
    if (menuItemId === CONTEXT_MENU_ID) {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: CONTEXT_MENU_ID })
      })
    }
  })
}
