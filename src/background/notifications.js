import { Logger } from '@dhruv-techapps/core-common'
import { Tabs } from '@dhruv-techapps/core-extension'

export default function registerNotifications(optionsPageUrl) {
  chrome.notifications.onClicked.addListener(notificationId => {
    if (notificationId !== 'rate') {
      Tabs.create({ properties: { url: optionsPageUrl } })
    }
  })

  chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    Logger.info('Notification onButtonClicked', notificationId, buttonIndex)
  })

  chrome.notifications.onClosed.addListener((notificationId, byUser) => {
    Logger.info('Notification onClosed', notificationId, byUser)
  })
}
