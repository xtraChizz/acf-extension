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

// eslint-disable-next-line prettier/prettier
;

;(() => {
  Logger.log(LOCAL_STORAGE_KEY)
  try {
    const {
      name,
      version,
      'config.uninstall_url': uninstallUrl,
      'config.variant': variant,
      'config.tracking_id': trackingId,
      'config.options_page_url': optionsPageUrl
    } = Manifest.values(['name', 'version', 'config.variant', 'config.uninstall_url', 'config.tracking_id', 'config.options_page_url'])
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
      [RUNTIME_MESSAGE.SOUND]: new Sound(),
      [RUNTIME_MESSAGE.CLOUD_MESSAGING]: new DiscordMessaging()
    }
    Runtime.onMessageExternal(onMessageListener)
    Runtime.onMessage(onMessageListener)
  } catch (error) {
    Logger.error(error)
    GoogleAnalytics.error({ error }, () => {})
  }
})()
