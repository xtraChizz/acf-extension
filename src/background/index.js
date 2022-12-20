/* eslint-disable no-new */

import { DateUtil, Logger, RUNTIME_MESSAGE } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { Runtime } from '@dhruv-techapps/core-extension'

import registerContextMenus from './context-menu'
import registerNotifications from './notifications'
import { TabsMessenger } from './tab'
import { RUNTIME_MESSAGE_ACF } from '../common/constant'
import Config from './config'
import DiscordMessaging from './discord-messaging'
import SaveConfig from './save-config'
import { Blog } from './check-blog'

try {
  fetch(chrome.runtime.getURL('configuration.json'))
    .then(r => r.json())
    .then(({ uninstall_url: uninstallUrl, options_page_url: optionsPageUrl }) => {
      /**
       * Setup Google Analytics
       */

      // new GoogleAnalytics(trackingId, variant)
      // GoogleAnalytics.pageView([], Logger.log)

      /**
       * Browser Action set to open option page / configuration page
       */
      chrome.action.onClicked.addListener(() => {
        TabsMessenger.optionsTab({ url: optionsPageUrl })
      })

      /**
       *  On initial install setup basic configuration
       */
      chrome.runtime.onInstalled.addListener(async () => {
        const result = await chrome.storage.local.get(LOCAL_STORAGE_KEY.INSTALL_DATE)
        if (!result[LOCAL_STORAGE_KEY.INSTALL_DATE]) {
          chrome.storage.local.set({ [LOCAL_STORAGE_KEY.INSTALL_DATE]: DateUtil.getDateWithoutTime().toJSON() })
          TabsMessenger.optionsTab({ url: optionsPageUrl })
        }
      })

      /**
       * Set Context Menu for right click
       */
      registerContextMenus(optionsPageUrl)

      /**
       * Set Notifications
       */
      registerNotifications(optionsPageUrl)

      /**
       * Setup Uninstall action
       */
      chrome.runtime.setUninstallURL(uninstallUrl)

      /**
       * On start up check for rate
       * TODO Need to implement rate us feature
       */
      chrome.runtime.onStartup.addListener(() => {
        // GoogleAnalytics.event({ event: ['version', version] }, Logger.log)
        Blog.check(optionsPageUrl)
      })
    })
    .catch(Logger.colorError)

  /**
   * If an update is available it will auto update
   */
  chrome.runtime.onUpdateAvailable.addListener(async () => {
    const { configs } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS)
    const key = `backup_${Date.now()}`
    chrome.storage.local.set({ [key]: configs })
    chrome.runtime.reload()
  })

  /**
   * Setup on Message Listener
   */
  const onMessageListener = {
    [RUNTIME_MESSAGE_ACF.CONFIG]: new Config(),
    [RUNTIME_MESSAGE_ACF.SAVE_CONFIG]: new SaveConfig(),
    [RUNTIME_MESSAGE.DISCORD_MESSAGING]: new DiscordMessaging()
  }
  Runtime.onMessageExternal(onMessageListener)
  Runtime.onMessage(onMessageListener)
} catch (error) {
  Logger.colorError(error)
  // GoogleAnalytics.error({ error }, () => {})
}
