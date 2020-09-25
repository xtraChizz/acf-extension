/* eslint-disable no-new */

import { DateUtil, LocalStorage, Logger, Manifest } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { GoogleAnalytics, Runtime, BrowserAction } from '@dhruv-techapps/core-extension'

import registerContextMenus from './context-menu'
import registerNotifications from './notifications'
import { TabsMessenger } from './tab'

(() => {
  try {
    const {
      name,
      'config.uninstall_url': uninstallUrl,
      'config.tracking_id': trackingId,
      'config.options_page_url': optionsPageUrl
    } = Manifest.values(['name',
      'config.uninstall_url',
      'config.tracking_id',
      'config.options_page_url'])
    /**
  * Browser Action set to open option page / configuration page
  * ? Do check if clicking this it dont open eveytime on new tab
  */
    BrowserAction.onClicked(() => {
      TabsMessenger.optionsTab({ url: optionsPageUrl })
    })

    /**
     *  On initial install setup basic configuration
     */
    Runtime.onInstalled(() => {
      if (!LocalStorage.getItem(LOCAL_STORAGE_KEY.INSTALL_DATE)) {
        localStorage.setItem(LOCAL_STORAGE_KEY.INSTALL_DATE, DateUtil.getDateWithoutTime().toJSON())
        TabsMessenger.optionsTab({ url: optionsPageUrl })
      }
    })
    /**
   * setup Google Analytics
   * TODO Need to check this as well
   */
    window.ga = new GoogleAnalytics(trackingId)

    /**
   * Setup Unintall action
   */
    Runtime.setUninstallURL(uninstallUrl)

    /**
     * Set Context Menu for right click
     */
    registerContextMenus(name, optionsPageUrl)
    registerNotifications(optionsPageUrl)

    /**
    * If an update is available it will auto update
    */
    Runtime.onUpdateAvailable(Runtime.reload)

  /**
  * On start up check for rate
  * TODO Need to make this up and available
  */
  // Runtime.onStartup(() => new Rate('', 5))
  } catch (error) {
    Logger.error(error)
  }
})()
