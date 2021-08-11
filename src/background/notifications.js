import { Logger } from '@dhruv-techapps/core-common'
import { Tabs } from '@dhruv-techapps/core-extension'
import { Rate } from './rate'

export default function registerNotifications(optionsPageUrl) {
  chrome.notifications.onClicked.addListener(notificationId => {
    switch (notificationId) {
      case 'rate':
        Rate.yesNotification()
        break
      case 'rate_yes':
        Rate.rate()
        break
      case 'rate_no':
        Rate.connectWithUs()
        break
      case 'error':
        Tabs.create({ properties: { url: optionsPageUrl } })
        break
      default:
        Logger.info('Notification onClicked', notificationId)
    }
  })

  chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    switch (notificationId) {
      case 'rate':
        if (buttonIndex === 0) {
          Rate.yesNotification()
        } else {
          Rate.noNotification()
        }
        break
      case 'rate_yes':
        if (buttonIndex === 0) {
          Rate.rate()
        } else {
          Rate.later()
        }
        break
      case 'rate_no':
        if (buttonIndex === 0) {
          Rate.createIssue()
        } else {
          Rate.connectWithUs()
        }
        break
      default:
        Logger.info('Notification onButtonClicked', notificationId, buttonIndex)
    }
  })

  chrome.notifications.onClosed.addListener((notificationId, byUser) => {
    Logger.info('Notification onClosed', notificationId, byUser)
  })
}
