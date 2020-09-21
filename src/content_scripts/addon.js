import { RADIO_CHECKBOX_NODENAME, SELECT_TEXTAREA_NODENAME } from './util'
import { ADDON_CONDITIONS } from '@dhruv-techapps/acf-common'
import { SystemError } from './error'
import { Logger } from '@dhruv-techapps/core-common'
import Common from './common'

const Addon = ((Common) => {
  const start = async ({ element, value, condition }) => {
    Logger.log('Addon - start')
    if (element && value && condition) {
      await Common.call(this, element)
      const nodeValue = _getNodeValue()
      _compare(nodeValue, condition, value)
    }
  }

  const _getNodeValue = () => {
    Logger.log('Addon - _getNodeValue')
    const node = this._nodes.snapshotItem(0)
    let value
    if (SELECT_TEXTAREA_NODENAME.test(node.nodeName)) {
      value = node.value
    } else if (node.nodeName === 'INPUT') {
      if (RADIO_CHECKBOX_NODENAME.test(node.type)) {
        value = node.checked
      } else {
        value = node.value
      }
    } else {
      value = node.innerText
    }
    return value
  }

  const _compare = (nodeValue, condition, value) => {
    Logger.log('Addon - _compare')
    switch (condition) {
      case ADDON_CONDITIONS['= Equals']:
        return new RegExp(`^${value}$`, 'gi').test(nodeValue)
      case ADDON_CONDITIONS['!= Not Equals']:
        return !new RegExp(`^${value}$`, 'gi').test(nodeValue)
      case ADDON_CONDITIONS['~ Contains']:
        return new RegExp(`${value}`, 'gi').test(nodeValue)
      case ADDON_CONDITIONS['> Greater Than']:
        return nodeValue > value
      case ADDON_CONDITIONS['>= Greater Than Equals']:
        return nodeValue >= value
      case ADDON_CONDITIONS['&lt; Less Than']:
        return nodeValue < value
      case ADDON_CONDITIONS['&lt;= Less Than Equals']:
        return nodeValue <= value
      default:
        throw new SystemError('Addon Condition not found', `${condition} condition not found`)
    }
  }

  return { start }
})(Common)

export default Addon
