/* eslint-disable no-new */

import { LocalStorage, DateUtil } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { Manifest, Tabs, ContextMenus, GoogleAnalytics, Runtime, BrowserAction } from '@dhruv-techapps/core-extension'
import Config from './config'
import { CONTEXT_MENU_ID } from '../common/constant'

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
  BrowserAction.onClicked(() => { new Tabs({ url: optionsPageUrl }) })
  /**
  * If an update is available it will auto update
  */
  Runtime.onUpdateAvailable(Runtime.reload)

  /**
  * Set Context Menu for right click
  */
  new ContextMenus({ id: CONTEXT_MENU_ID, title: String(name) }).onClicked(({ menuItemId }) => {
    if (menuItemId === CONTEXT_MENU_ID) {
      new Tabs({ xpath: LocalStorage.getItem(LOCAL_STORAGE_KEY.XPATH), url: LocalStorage.getItem(LOCAL_STORAGE_KEY.URL) })
      LocalStorage.removeItem(LOCAL_STORAGE_KEY.XPATH)
      LocalStorage.removeItem(LOCAL_STORAGE_KEY.URL)
    }
  })

  /**
  * On initial install setup basic configuration
  */
  Runtime.onInstalled(() => {
    if (!LocalStorage.getItem(LOCAL_STORAGE_KEY.INSTALL_DATE, null)) {
      LocalStorage.setItem(LOCAL_STORAGE_KEY.INSTALL_DATE, DateUtil.getDateWithoutTime().toJSON())
      new Tabs({ url: optionsPageUrl })
    }
  })

  /**
  * On start up check for rate
  */
  // Runtime.onStartup(() => new Rate('', 5))

  /**
  * setup Google Analytics
  */
  window.ga = new GoogleAnalytics(trackingId)

  /**
  * Setup Unintall action
  */
  Runtime.setUninstallURL(uninstallUrl)

  /**
  * Setting up port to listen between content_script and popup
  */
  Runtime.onMessageExternal(externallyConnectable, { [Config.name]: new Config() })
})()
