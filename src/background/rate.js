import { DateUtil, I18n, IS_EDGE, LOCAL_STORAGE_CORE_KEY, LocalStorage, Logger } from '@dhruv-techapps/core-common'
import { Notifications, Tabs } from '@dhruv-techapps/core-extension'

const defaultRateData = { isRated: false }

const notificationOptions = {
  title: I18n.value('@RATE__title'),
  message: I18n.value('@RATE__message'),
  requireInteraction: true,
  buttons: [{ title: I18n.value('@RATE__yes_button') }, { title: I18n.value('@RATE__no_button') }]
}

const notificationYesOptions = {
  title: I18n.value('@RATE__yes_title'),
  message: I18n.value('@RATE__yes_message'),
  requireInteraction: true,
  buttons: [{ title: I18n.value('@RATE__rate_button') }, { title: I18n.value('@RATE__later_button') }]
}

const notificationNoOptions = {
  title: I18n.value('@RATE__no_title'),
  message: I18n.value('@RATE__no_message'),
  requireInteraction: true,
  buttons: [{ title: I18n.value('@RATE__issue_button') }, { title: I18n.value('@RATE__connect_button') }]
}

export class Rate {
  constructor(skipDays = 5) {
    this.data = LocalStorage.getItem(LOCAL_STORAGE_CORE_KEY.RATE_DATA, defaultRateData)
    if (!this.data.isRated && this.checkInstallDate(skipDays)) {
      if (!this.recentlyShown(this.data.lastShownDate)) {
        Logger.log(this.data)
        Notifications.create({ notificationId: 'rate', notificationOptions })
      }
    }
  }

  static rate() {
    LocalStorage.setItem(LOCAL_STORAGE_CORE_KEY.RATE_DATA, { ...this.data, isRated: true })
    const url = IS_EDGE ? `https://microsoftedge.microsoft.com/addons/detail/${chrome.runtime.id}` : `https://chrome.google.com/webstore/detail/iapifmceeokikomajpccajhjpacjmibe/reviews#write-a-review`
    Tabs.create({ properties: { url } })
  }

  static later() {
    LocalStorage.setItem(LOCAL_STORAGE_CORE_KEY.RATE_DATA, { ...this.data, lastShownDate: DateUtil.getDateWithoutTime().toJSON() })
    Notifications.clear({ notificationId: 'rate_yes' })
  }

  static createIssue() {
    LocalStorage.setItem(LOCAL_STORAGE_CORE_KEY.RATE_DATA, { ...this.data, lastShownDate: DateUtil.getDateWithoutTime().toJSON() })
    Tabs.create({ properties: { url: 'https://github.com/Dhruv-Techapps/auto-click-auto-fill/issues' } })
  }

  static connectWithUs() {
    LocalStorage.setItem(LOCAL_STORAGE_CORE_KEY.RATE_DATA, { ...this.data, lastShownDate: DateUtil.getDateWithoutTime().toJSON() })
    Tabs.create({ properties: { url: 'https://discord.gg/hArVQns' } })
  }

  static yesNotification() {
    Logger.log(notificationYesOptions)
    Notifications.clear({ notificationId: 'rate' })
    Notifications.create({ notificationId: 'rate_yes', notificationOptions: notificationYesOptions })
  }

  static noNotification() {
    Logger.log(notificationNoOptions)
    Notifications.clear({ notificationId: 'rate' })
    Notifications.create({ notificationId: 'rate_no', notificationOptions: notificationNoOptions })
  }

  checkInstallDate(skipDays) {
    const installDate = LocalStorage.getItem(LOCAL_STORAGE_CORE_KEY.INSTALL_DATE)
    installDate.setDate(installDate.getDate() + skipDays)
    return installDate.getTime() < DateUtil.getDateWithoutTime().getTime()
  }

  recentlyShown(lastShownDate) {
    if (!lastShownDate) {
      return false
    }
    lastShownDate.setDate(lastShownDate.getDate() + 7)
    return lastShownDate.getTime() > DateUtil.getDateWithoutTime().getTime()
  }
}
