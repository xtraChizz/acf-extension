/* eslint-disable no-console */
import { ACTION_ACTIONS, store } from './store'
import { WizardElementUtil } from './element-util'

export const Action = (() => {
  const check = element => {
    WizardElementUtil.check(element, true).then(action => {
      if (action.elementFinder) {
        store.dispatch({ type: ACTION_ACTIONS.UPDATE, payload: action })
      }
    })
  }

  const setup = () => {
    document.addEventListener('click', event => {
      check(event.target)
    })
    document.addEventListener('keyup', event => {
      if (event.key === 'Tab') {
        check(event.target)
      }
    })
  }

  return { setup }
})()
