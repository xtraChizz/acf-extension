/* eslint-disable no-console */
import { ACTION_POPUP } from '../common/constant'
import { Action } from './action'
import { Config } from './config'
import { IndividualField } from './individual-field'
import { Popup } from './popup'

chrome.runtime.onMessage.addListener(async msg => {
  if (msg.action === ACTION_POPUP) {
    const autoClicker = document.querySelector('auto-clicker-autofill-popup')
    if (autoClicker) {
      autoClicker.shadowRoot.querySelector('button[aria-label="collapse"]').click()
    } else {
      const config = await Config.setup()
      await Popup.setup(config)
      Action.setup()
    }
  }
})

IndividualField.setup()

fetch(chrome.runtime.getURL('/html/wizard-popup.html'))
  .then(r => r.text())
  .then(html => document.body.insertAdjacentHTML('beforeend', html))
