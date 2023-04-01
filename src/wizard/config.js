import { LOCAL_STORAGE_KEY, defaultConfig } from '@dhruv-techapps/acf-common'
import { store } from './store'

export const Config = (() => {
  let config
  const subscribe = url => {
    store.subscribe(async () => {
      const { actions } = store.getState()
      config.actions = actions

      const { configs = [] } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS)
      const index = configs.findIndex(_config => _config.enable && _config.url === url)
      if (index !== -1) {
        configs[index] = config
      } else {
        configs.push(config)
      }
      chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: configs })
    })
  }

  const getName = name => {
    if (name.length > 38) {
      name = `${name.substr(0, 27)}...${name.substr(name.length - 10, name.length)}`
    }

    // eslint-disable-next-line no-alert
    const configName = prompt('Configuration name:', name)
    if (configName != null) {
      return configName
    }
    return getName()
  }

  const getNewConfig = url => {
    const { host, pathname } = document.location
    const name = host + pathname
    config = { ...defaultConfig }
    config.url = url
    config.name = getName(name)
    config.actions = []
    return config
  }

  const setup = async () => {
    const { origin, pathname } = document.location
    const url = origin + pathname
    subscribe(url)
    const { configs = [] } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS)
    config = configs.find(_config => _config.enable && _config.url === url)
    return config || getNewConfig(url, pathname)
  }

  return { setup }
})()
