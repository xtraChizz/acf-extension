/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
import { defaultConfig } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
import { Listener } from './listener'

const { RUNTIME_MESSAGE_ACF } = require('../common/constant')

export const FormGenerator = (() => {
  let config

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

  const checkConfiguration = () => {
    chrome.runtime.sendMessage(chrome.runtime.id, { action: RUNTIME_MESSAGE_ACF.CONFIG, href: document.location.href, frameElement: window.top !== window.self }, response => {
      config = response
      if (config) {
        // eslint-disable-next-line no-restricted-globals
        const result = confirm(`Do you want to append to existing configuration "${config.name || config.url}" ?`)
        // If the choice is to create new configuration
        if (!result) {
          config = getConfig()
        }
      } else {
        config = getConfig()
      }
      attachFieldListener()
    })
  }

  const listener = element => {
    Listener.check(element).then(action => {
      if (action.elementFinder) {
        const index = config.actions.findIndex(_action => _action.elementFinder === action.elementFinder)
        if (index !== -1) {
          Logger.colorDebug(action, 'updated')
          config.actions[index].value = action.value
        } else {
          Logger.colorDebug(action, 'added')
          config.actions.push(action)
        }
      }
    })
  }

  const attachFieldListener = () => {
    document.addEventListener('click', e => {
      const { autoClicker } = e.target.dataset
      if (!autoClicker) {
        listener(e.target)
      }
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

  const startListener = () => {
    document.querySelector('auto-clicker-autofill button[stop]').hidden = false
    document.querySelector('auto-clicker-autofill button[start]').hidden = true
    checkConfiguration()
  }

  const stopListener = () => {
    chrome.runtime.sendMessage(chrome.runtime.id, { action: RUNTIME_MESSAGE_ACF.SAVE_CONFIG, config }, response => {
      document.querySelector('auto-clicker-autofill button[start]').hidden = true
      document.querySelector('auto-clicker-autofill button[stop]').hidden = true
      document.querySelector('auto-clicker-autofill #message').innerHTML = response
      document.querySelector('auto-clicker-autofill #message').hidden = false
      setTimeout(clear, 5000)
    })
  }

  const addHTML = () =>
    fetch(chrome.runtime.getURL('/assets/wizard.html'))
      .then(r => r.text())
      .then(html => document.body.insertAdjacentHTML('beforeend', html))

  const setup = async () => {
    await addHTML()
    attachButtonListener()
  }

  return { setup }
})()
