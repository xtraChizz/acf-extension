
import { Logger } from '@dhruv-techapps/core-common'
import { Runtime, Tabs } from '@dhruv-techapps/core-extension'
import { RUNTIME_MESSAGE_ACF } from '../common/constant'
import Config from './config'

export default function registerNotifications (optionsPageUrl) {
  const onMessageListener = { [RUNTIME_MESSAGE_ACF.CONFIG]: new Config() }
  Runtime.onMessageExternal(onMessageListener)
  Runtime.onMessage(onMessageListener)

  chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId !== 'rate') {
      Tabs.create({ properties: { url: optionsPageUrl } })
    }
    Logger.info('Notification onClicked', notificationId)
  })

  chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    Logger.info('Notification onButtonClicked', notificationId, buttonIndex)
  })

  chrome.notifications.onClosed.addListener((notificationId, byUser) => {
    Logger.info('Notification onClosed', notificationId, byUser)
  })
}
