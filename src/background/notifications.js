import { Logger } from '@dhruv-techapps/core-common'

export default function registerNotifications(optionsPageUrl) {
  chrome.notifications.onClicked.addListener(notificationId => {
    switch (notificationId) {
      case 'error':
        chrome.tabs.create({ url: optionsPageUrl })
        break
      default:
        Logger.colorInfo('Notification onClicked', notificationId)
    }
  })

  chrome.notifications.onClosed.addListener((notificationId, byUser) => {
    Logger.colorInfo('Notification onClosed', notificationId, byUser)
  })
}
