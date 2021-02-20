import { RADIO_CHECKBOX_NODE_NAME, SELECT_TEXTAREA_NODE_NAME, wait } from './util'
import { ADDON_CONDITIONS, RECHECK_OPTIONS } from '@dhruv-techapps/acf-common'
import { ConfigError, SystemError } from './error'
import Common from './common'
import { BrowserActionService, Logger } from '@dhruv-techapps/core-common'

const Addon = ((Common) => {
  const _start = async ({ elementFinder, value, condition, valueExtractor, ...props }, settings) => {
    // Logger.debug('\t\t\t\t\t Addon >> _start')
    const elements = await Common.start(elementFinder, settings)
    const nodeValue = _getNodeValue(elements, valueExtractor)
    return _compare(nodeValue, condition, value) || await _recheckFunc({ elementFinder, value, condition, valueExtractor, ...props })
  }

  const _recheckFunc = async ({ elementFinder, value, condition, recheck, recheckInterval, recheckOption, valueExtractor }) => {
    // Logger.debug('\t\t\t\t\t Addon >> _recheckFunc')
    if (recheck > 0) {
      recheck--
      BrowserActionService.setBadgeBackgroundColor({ color: [13, 202, 240, 1] })
      BrowserActionService.setBadgeText({ text: 'Recheck' })
      await wait(recheckInterval, 'Addon Recheck')
      return await _start({ elementFinder, value, condition, recheck, recheckInterval, recheckOption, valueExtractor })
    } else {
      if (recheckOption === RECHECK_OPTIONS.RELOAD) {
        if (document.readyState === 'complete') {
          location.reload()
        } else {
          window.addEventListener('load', function () {
            location.reload()
          })
        }
      } else if (recheckOption === RECHECK_OPTIONS.STOP) {
        throw new ConfigError(`elementFinder: ${elementFinder}\nvalue: ${value}\ncondition: ${condition}`, 'Not Matched')
      } else {
        Logger.info('Value not matched and action is SKIP')
        return false
      }
    }
  }

  const check = async ({ elementFinder, value, condition, ...props } = {}) => {
    // Logger.debug('\t\t\t\t\t Addon >> check')
    if (elementFinder && value && condition) {
      return await _start({ elementFinder, value, condition, ...props })
    }
    return true
  }

  const _getNodeValue = (elements, valueExtractor) => {
    // Logger.debug('\t\t\t\t\t Addon >> _getNodeValue')
    const element = elements[0]
    let value
    if (SELECT_TEXTAREA_NODE_NAME.test(element.nodeName)) {
      value = element.value
    } else if (element.nodeName === 'INPUT') {
      if (RADIO_CHECKBOX_NODE_NAME.test(element.type)) {
        value = element.checked
      } else {
        value = element.value
      }
    } else if (element.nodeName === 'DIV' && element.isContentEditable) {
      value = element.textContent
    } else {
      value = element.innerText
    }
    if (valueExtractor) {
      const match = RegExp(valueExtractor).exec(value)
      return (match && match[0]) || value
    }
    return value
  }

  const _compare = (nodeValue, condition, value) => {
    // Logger.debug('\t\t\t\t\t Addon >> _compare')
    switch (condition) {
      case ADDON_CONDITIONS['= Equals']:
        return new RegExp(`^${value}$`, 'gi').test(nodeValue)
      case ADDON_CONDITIONS['!= Not Equals']:
        return !new RegExp(`^${value}$`, 'gi').test(nodeValue)
      case ADDON_CONDITIONS['~ Contains']:
        return new RegExp(`${value}`, 'gi').test(nodeValue)
      case ADDON_CONDITIONS['!~ Not Contains']:
        return !new RegExp(`${value}`, 'gi').test(nodeValue)
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
