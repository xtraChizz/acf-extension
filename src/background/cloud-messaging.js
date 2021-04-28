import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { LocalStorage, Logger, Manifest } from '@dhruv-techapps/core-common'
import { GoogleAnalytics } from '@dhruv-techapps/core-extension'

export default class CloudMessaging {
  processPortMessage({ notification }) {
    try {
      const settings = LocalStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS)
      if (settings) {
        const { pushNotificationKey: to } = settings
        if (to) {
          const { 'config.cypher': cypher, 'config.gcm_url': url } = Manifest.values(['config.cypher', 'config.gcm_url'])
          this.postData(url, { to, notification }, `key=${cypher}`)
            .then(Logger.log)
            .catch(error => {
              Logger.error(error)
              GoogleAnalytics.error({ error }, () => {})
            })
        }
      }

      return {}
    } catch (error) {
      Logger.error(error)
      GoogleAnalytics.error({ error }, () => {})
    }
    return false
  }

  async postData(url = '', data = {}, Authorization) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}
