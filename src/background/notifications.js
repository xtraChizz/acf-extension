import { CHROME, Logger } from '@dhruv-techapps/core-common'

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

export class NotificationHandler {
  static async notify(id, title, message, requireInteraction = true) {
    const { action } = await chrome.runtime.getManifest()
    const defaultOptions = {
      type: CHROME.NOTIFICATIONS_OPTIONS.TYPE.BASIC,
      iconUrl: action.default_icon,
      title,
      message,
      requireInteraction,
      silent: false
    }
    chrome.notifications.create(id, { ...defaultOptions })
  }
}
