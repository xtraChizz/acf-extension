/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
import { defaultConfig } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
import { Service } from '@dhruv-techapps/core-services'
import { Listener } from './listener'

const { CONTEXT_MENU_ID, RUNTIME_MESSAGE_ACF } = require('../common/constant')

let config

export const Generator = (() => {
  const addHTML = async () =>
    fetch(chrome.runtime.getURL('/assets/wizard.html'))
      .then(r => r.text())
      .then(html => {
        document.body.insertAdjacentHTML('beforeend', html)
      })

  const getName = () => {
    const configName = prompt('Please enter configuration name', window.location.host)
    if (configName != null) {
      return configName
    }
    return getName()
  }

  const getConfig = () => {
    config = { ...defaultConfig }
    config.new = true
    config.url = document.location.href
    config.name = getName()
    config.actions = []
    return config
  }

  const checkConfiguration = async () => {
    config = await Service.message({ action: RUNTIME_MESSAGE_ACF.CONFIG, href: document.location.href, frameElement: window.top !== window.self })
    if (config) {
      // eslint-disable-next-line no-restricted-globals
      const result = confirm(`Do you want to append to existing configuration "${config.name}" ?`)
      if (!result) {
        config = getConfig()
      }
    } else {
      config = getConfig()
    }
    return config
  }

  const listener = element => {
    Listener.check(element)
      .then(action => {
        if (action.elementFinder) {
          const index = config.actions.findIndex(_action => _action.elementFinder === action.elementFinder)
          if (index !== -1) {
            Logger.info(action, 'updated')
            config.actions[index].value = action.value
          } else {
            Logger.info(action, 'added')
            config.actions.push(action)
          }
        }
      })
      .finally(() => {
        // eslint-disable-next-line no-use-before-define
        setTimeout(checkActiveElement, 500)
      })
  }

  const checkActiveElement = () => {
    const element = document.activeElement
    if (element.nodeName !== 'HEAD' || element.nodeName !== 'BODY') {
      listener(element)
    }
  }

  const attachFieldListener = () => {
    document.addEventListener('click', e => {
      listener(e.target)
    })
  }

  const attachButtonListener = () => {
    document.querySelector('auto-clicker-autofill button[start]').addEventListener('click', startListener)
    document.querySelector('auto-clicker-autofill button[stop]').addEventListener('click', stopListener)
  }

  const removeButtonListener = () => {
    document.querySelector('auto-clicker-autofill button[start]').removeEventListener('click', startListener)
    document.querySelector('auto-clicker-autofill button[stop]').removeEventListener('click', stopListener)
  }

  const clear = () => {
    removeButtonListener()
    const autoClicker = document.querySelector('auto-clicker-autofill')
    autoClicker.parentNode.removeChild(autoClicker)
  }

  const startListener = async () => {
    document.querySelector('auto-clicker-autofill button[stop]').hidden = false
    document.querySelector('auto-clicker-autofill button[start]').hidden = true
    await checkConfiguration()
    attachFieldListener()
  }

  const stopListener = () => {
    Service.message({ action: RUNTIME_MESSAGE_ACF.SAVE_CONFIG, config })
    document.querySelector('auto-clicker-autofill button[start]').hidden = true
    document.querySelector('auto-clicker-autofill button[stop]').hidden = true
    document.querySelector('auto-clicker-autofill #message').hidden = false
    setTimeout(clear, 5000)
  }

  const setup = async () => {
    await addHTML()
    attachButtonListener()
  }

  return { setup }
})()

chrome.extension.onMessage.addListener(msg => {
  if (msg.action === CONTEXT_MENU_ID) {
    Generator.setup()
  }
})
