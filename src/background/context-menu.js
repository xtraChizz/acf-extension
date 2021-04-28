import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { LocalStorage } from '@dhruv-techapps/core-common'
import { ContextMenus } from '@dhruv-techapps/core-extension'
import { CONTEXT_MENU_ID } from '../common/constant'
import { TabsMessenger } from './tab'

export default function registerContextMenus(title, optionsPageUrl) {
  // eslint-disable-next-line no-new
  new ContextMenus({ id: CONTEXT_MENU_ID, title, contexts: ['all'] })

  chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
    if (menuItemId === CONTEXT_MENU_ID) {
      const url = `${optionsPageUrl}?url=${encodeURIComponent(LocalStorage.getItem(LOCAL_STORAGE_KEY.URL))}&elementFinder=${encodeURIComponent(LocalStorage.getItem(LOCAL_STORAGE_KEY.XPATH))}`
      TabsMessenger.optionsTab({ url })
      LocalStorage.removeItem(LOCAL_STORAGE_KEY.XPATH)
      LocalStorage.removeItem(LOCAL_STORAGE_KEY.URL)
    }
  })
}
