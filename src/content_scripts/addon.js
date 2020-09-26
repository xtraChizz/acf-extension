import { RADIO_CHECKBOX_NODENAME, SELECT_TEXTAREA_NODENAME, wait } from './util'
import { ADDON_CONDITIONS } from '@dhruv-techapps/acf-common'
import { SystemError } from './error'
import { Logger } from '@dhruv-techapps/core-common'
import Common from './common'

const Addon = ((Common) => {
  const _start = async ({ elementFinder, value, condition, retry, retryInterval, valueExtractor }) => {
    Logger.debug('\t\t\t\t\t Addon >> _start')
    const elements = await Common.start(elementFinder)
    const nodeValue = _getNodeValue(elements, valueExtractor)
    return _compare(nodeValue, condition, value) || await _retryFunc({ elementFinder, value, condition, retry, retryInterval, valueExtractor })
  }

  const _retryFunc = async ({ elementFinder, value, condition, retry, retryInterval, valueExtractor }) => {
    Logger.debug('\t\t\t\t\t Addon >> _retryFunc')
    if (retry > 0) {
      retry--
      await wait(retryInterval)
      return await _start({ elementFinder, value, condition, retry, retryInterval, valueExtractor })
    } else {
      return false
    }
  }

  const check = async ({ elementFinder, value, condition, ...props }) => {
    Logger.debug('\t\t\t\t\t Addon >> check')
    if (elementFinder && value && condition) {
      return await _start({ elementFinder, value, condition, ...props })
    }
    return true
  }

  const _getNodeValue = (elements, valueExtractor) => {
    Logger.debug('\t\t\t\t\t Addon >> _getNodeValue')
    const element = elements[0]
    let value
    if (SELECT_TEXTAREA_NODENAME.test(element.nodeName)) {
      value = element.value
    } else if (element.nodeName === 'INPUT') {
      if (RADIO_CHECKBOX_NODENAME.test(element.type)) {
        value = element.checked
      } else {
        value = element.value
      }
    } else {
      value = element.innerText
    }
    if (valueExtractor) {
      const match = RegExp(valueExtractor).exec(value)
      return (match && match[0]) || value
    }
    return (valueExtractor && value.match(RegExp(valueExtractor))) || value
  }

  const _compare = (nodeValue, condition, value) => {
    Logger.debug('\t\t\t\t\t Addon >> _compare')
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

  return { check }
})(Common)

export default Addon
