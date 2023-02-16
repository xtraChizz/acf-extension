/* eslint-disable no-console */
import { Auto } from './auto'
import { WizardElementUtil } from './element-util'
import { ACTION_ACTIONS, store } from './store'
import { OPTIONS_PAGE_URL } from '../common/environments'

export const Popup = (() => {
  let popupContainer

  const setHover = (xpath, operation) => {
    xpath = WizardElementUtil.clearXpath(xpath)
    const nodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    if (nodes.snapshotLength !== 0) {
      let i = 0
      while (i < nodes.snapshotLength) {
        nodes.snapshotItem(i).classList[operation]('auto-clicker-hover')
        i += 1
      }
    }
  }

  const attachPopupListener = () => {
    popupContainer.addEventListener('close', () => {
      popupContainer.remove()
    })

    popupContainer.addEventListener('remove', e => {
      store.dispatch({ type: ACTION_ACTIONS.REMOVE, payload: e.detail.index })
    })

    popupContainer.addEventListener('auto-generate-config', () => {
      Auto.generate()
    })

    popupContainer.addEventListener('enter', ({ detail: { xpath } }) => {
      setHover(xpath, 'add')
    })
    popupContainer.addEventListener('leave', ({ detail: { xpath } }) => {
      setHover(xpath, 'remove')
    })
    popupContainer.addEventListener('element-focus', ({ detail: { xpath } }) => {
      xpath = WizardElementUtil.clearXpath(xpath)
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      result.singleNodeValue.focus()
    })
  }

  const setSettingsUrl = () => popupContainer.setAttribute('settings', OPTIONS_PAGE_URL)

  const storeSubscribe = () => {
    store.subscribe(() => {
      const { actions } = store.getState()
      popupContainer.setAttribute('actions', JSON.stringify(actions))
    })
  }

  const setup = async ({ name, actions }) => {
    popupContainer = document.createElement('auto-clicker-autofill-popup')
    await setSettingsUrl()
    popupContainer.setAttribute('name', name)
    document.body.appendChild(popupContainer)
    storeSubscribe()
    if (actions.length !== 0) {
      store.dispatch({ type: ACTION_ACTIONS.UPDATE_ALL, payload: actions })
    }
    attachPopupListener()
  }

  return { setup }
})()
