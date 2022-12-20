import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'

export default class SaveConfig {
  async processPortMessage({ config }) {
    const { configs } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS)
    const index = configs.findIndex(_config => config.name === _config.name || config.url === _config.url)
    if (index !== -1 && !config.new) {
      configs.splice(index, 1, config)
    } else {
      delete config.new
      configs.push(config)
    }
    await chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: configs })
    return 'Configuration saved. refresh page'
  }
}
