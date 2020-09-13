
import { Manifest, Tabs, LocalStorage, LocalStorageKey, ContextMenus, DateUtil, GoogleAnalytics, Runtime, BrowserAction, Rate } from '@dhruv-techapps/core-extension'
import Config from './config'

export const CONTEXT_MENU_ID = 'xpath-selection';

(() => {
  const {
    name,
    'config.uninstall_url': uninstallUrl,
    'config.tracking_id': trackingId,
    'config.options_page_url': optionsPageUrl,
    'externally_connectable.matches': externallyConnectable
  } = Manifest.values([
    'name',
    'config.uninstall_url',
    'config.tracking_id',
    'config.options_page_url',
    'externally_connectable.matches'])

  /**
  * Browser Action set to open option page / configuration page
  */
  BrowserAction.onClicked(() => { Tabs({ url: optionsPageUrl }) })
  /**
  * If an update is available it will auto update
  */
  Runtime.onUpdateAvailable(Runtime.reload)

  /**
  * Set Context Menu for right click
  */
  new ContextMenus({ id: CONTEXT_MENU_ID, title: String(name) }).onClicked(({ menuItemId }) => {
    if (menuItemId === CONTEXT_MENU_ID) {
      // Tab.getInst().openOptionsPage({ xpath: LocalStorage.getItem(LocalStorageKey.XPATH), url: LocalStorage.getItem(LocalStorageKey.URL) });
      LocalStorage.removeItem(LocalStorageKey.XPATH)
      LocalStorage.removeItem(LocalStorageKey.URL)
    }
  })

  /**
  * On initial install setup basic configuration
  */
  Runtime.onInstalled(() => {
    if (!LocalStorage.getItem(LocalStorageKey.INSTALL_DATE, null)) {
      LocalStorage.setItem(LocalStorageKey.INSTALL_DATE, DateUtil.getCurrentDate().toJSON())
      Tabs({ url: optionsPageUrl })
    }
  })

  /**
  * On start up check for rate
  */
  Runtime.onStartup(() => new Rate('', 5))

  /**
  * setup Google Analytics
  */
  GoogleAnalytics(trackingId)

  /**
  * Setup Unintall action
  */
  Runtime.setUninstallURL(uninstallUrl)

  /**
  * Setting up port to listen between content_script and popup
  */
  Runtime.onConnectExternal(externallyConnectable, { [Config.name]: new Config() })
})()
