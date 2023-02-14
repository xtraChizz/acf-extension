/* eslint-disable no-console */
import { createStore } from 'redux'
import { WizardElementUtil } from './element-util'

export const ACTION_ACTIONS = {
  UPDATE: 'updateAction',
  UPDATE_ALL: 'updateAllAction',
  REMOVE: 'removeAction'
}

// eslint-disable-next-line default-param-last
function counterReducer(state = { actions: [] }, { type, payload }) {
  switch (type) {
    case ACTION_ACTIONS.UPDATE: {
      const { actions } = state

      const { elementFinder, elementType, name, checked } = payload
      const index = actions.findIndex(_action => {
        // Select
        const selectXpath = WizardElementUtil.clearXpath(elementFinder)
        if (selectXpath !== elementFinder) {
          return WizardElementUtil.clearXpath(_action.elementFinder) === selectXpath
        }
        // Radio && Checkbox
        if (checked !== undefined) {
          return _action.elementType === elementType && _action.name === name
        }
        return _action.elementFinder === elementFinder
      })

      if (checked === false) {
        if (index !== -1) {
          actions.splice(index, 1)
        }
      } else if (index !== -1) {
        actions[index] = payload
      } else {
        actions.push(payload)
      }

      return { actions }
    }
    case ACTION_ACTIONS.UPDATE_ALL: {
      const actions = payload.filter(action => action.checked !== false)
      return { actions }
    }
    case ACTION_ACTIONS.REMOVE: {
      const { actions } = state
      actions.splice(payload, 1)
      return { actions }
    }
    default:
      return state
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
export const store = createStore(counterReducer)
