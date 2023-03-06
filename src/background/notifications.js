import { Logger } from '@dhruv-techapps/core-common'

export default function registerNotifications(optionsPageUrl) {
  chrome.notifications.onClicked.addListener(notificationId => {
    if (notificationId === 'error') {
      chrome.tabs.create({ url: optionsPageUrl })
    }
  })

  chrome.notifications.onClosed.addListener((notificationId, byUser) => {
    Logger.colorInfo('Notification onClosed', notificationId, byUser)
  })
}
