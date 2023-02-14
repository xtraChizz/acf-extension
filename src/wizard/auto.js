/* eslint-disable no-console */
import { WizardElementUtil } from './element-util'
import { ACTION_ACTIONS, store } from './store'

export const Auto = (() => {
  const generate = async () => {
    const payload = []
    await document.querySelectorAll('input, select, textarea, [contenteditable="true"]').forEach(async element => {
      const action = await WizardElementUtil.check(element)
      if (action.elementFinder) {
        payload.push(action)
      }
    })
    if (payload.length !== 0) {
      store.dispatch({ type: ACTION_ACTIONS.UPDATE_ALL, payload })
    }
  }
  return { generate }
})()
