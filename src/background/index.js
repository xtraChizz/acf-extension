/* eslint-disable no-new, no-use-before-define */

import { DateUtil, LocalStorage, Logger, Manifest, RUNTIME_MESSAGE } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { BrowserAction, GoogleAnalytics, Runtime } from '@dhruv-techapps/core-extension'

import registerContextMenus from './context-menu'
import registerNotifications from './notifications'
import { TabsMessenger } from './tab'
import { RUNTIME_MESSAGE_ACF } from '../common/constant'
import Sound from './sound'
import Config from './config'
import { UpdateData } from './update-data'
import DiscordMessaging from './discord-messaging'
import SaveConfig from './save-config'

// eslint-disable-next-line prettier/prettier
;

;(() => {
  try {
    const { name, version } = Manifest.values(['name', 'version'])
    fetch(chrome.runtime.getURL('configuration.json'))
      .then(r => r.json())
      .then(({ uninstall_url: uninstallUrl, variant, tracking_id: trackingId, options_page_url: optionsPageUrl }) => {
        Logger.info(optionsPageUrl)
        /**
         * Setup Google Analytics
         */
        new GoogleAnalytics(trackingId, variant)
        GoogleAnalytics.pageView([], Logger.log)
        /**
         * Browser Action set to open option page / configuration page
         */
        BrowserAction.onClicked(() => {
          TabsMessenger.optionsTab({ url: optionsPageUrl })
        })

        /**
         *  On initial install setup basic configuration
         */
        Runtime.onInstalled(() => {
          UpdateData.checkConfig()
          UpdateData.checkSettings()
          if (!LocalStorage.getItem(LOCAL_STORAGE_KEY.INSTALL_DATE)) {
            localStorage.setItem(LOCAL_STORAGE_KEY.INSTALL_DATE, DateUtil.getDateWithoutTime().toJSON())
            TabsMessenger.optionsTab({ url: optionsPageUrl })
          }
        })

        /**
         * Setup Uninstall action
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
        Runtime.onUpdateAvailable(() => {
          LocalStorage.setItem(`backup_${Date.now()}`, LocalStorage.getItem(LOCAL_STORAGE_KEY.CONFIGS))
          Runtime.reload()
        })

        /**
         * On start up check for rate
         * TODO Need to implement rate us feature
         */
        Runtime.onStartup(() => {
          GoogleAnalytics.event({ event: ['version', version] }, Logger.log)
          UpdateData.checkConfig()
          UpdateData.checkSettings()
        })

        const onMessageListener = {
          [RUNTIME_MESSAGE_ACF.CONFIG]: new Config(),
          [RUNTIME_MESSAGE_ACF.SAVE_CONFIG]: new SaveConfig(),
          [RUNTIME_MESSAGE.SOUND]: new Sound(),
          [RUNTIME_MESSAGE.CLOUD_MESSAGING]: new DiscordMessaging()
        }
        Runtime.onMessageExternal(onMessageListener)
        Runtime.onMessage(onMessageListener)
      })
      .catch(Logger.error)
  } catch (error) {
    Logger.error(error)
    GoogleAnalytics.error({ error }, () => {})
  }
})()
