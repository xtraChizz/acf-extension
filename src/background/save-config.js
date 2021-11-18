import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { LocalStorage } from '@dhruv-techapps/core-common'

export default class SaveConfig {
  processPortMessage(request) {
    const { config } = request
    const configs = LocalStorage.getItem(LOCAL_STORAGE_KEY.CONFIGS)
    const index = configs.findIndex(_config => config.name === _config.name || config.url === _config.url)
    if (index !== -1 && !config.new) {
      configs.splice(index, 1, config)
    } else {
      delete config.new
      configs.push(config)
    }
    LocalStorage.setItem(LOCAL_STORAGE_KEY.CONFIGS, configs)
    return {}
  }
}
