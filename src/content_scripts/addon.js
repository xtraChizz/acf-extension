import { ADDON_CONDITIONS, RECHECK_OPTIONS } from '@dhruv-techapps/acf-common'
import { BrowserActionService } from '@dhruv-techapps/core-services'
import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODE_NAME, SELECT_TEXTAREA_NODE_NAME, wait } from './util'
import { ConfigError, SystemError } from './error'
import Common from './common'

const Addon = (() => {
  const recheckFunc = async ({ elementFinder, value, condition, recheck, recheckInterval, recheckOption, valueExtractor }) => {
    Logger.debug('\t\t\t\t\t Addon >> recheckFunc')
    if (recheck > 0) {
      recheck -= 1
      BrowserActionService.setBadgeBackgroundColor({ color: [13, 202, 240, 1] })
      BrowserActionService.setBadgeText({ text: 'Recheck' })
      await wait(recheckInterval, 'Addon Recheck')
      // eslint-disable-next-line no-use-before-define
      return await start({ elementFinder, value, condition, recheck, recheckInterval, recheckOption, valueExtractor })
    }
    // eslint-disable-next-line no-console
    console.table([{ elementFinder, value, condition }])
    if (recheckOption === RECHECK_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        window.location.reload()
      } else {
        window.addEventListener('load', () => {
          window.location.reload()
        })
      }
    } else if (recheckOption === RECHECK_OPTIONS.STOP) {
      throw new ConfigError('Not Matched', 'Action is STOP')
    }
    Logger.info('Not Matched and action is SKIP')
    return false
  }

  const getNodeValue = (elements, valueExtractor) => {
    Logger.debug('\t\t\t\t\t Addon >> getNodeValue')
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
      if (/^@\w+(-\w+)?$/.test(valueExtractor)) {
        return element.getAttribute(valueExtractor.replace('@', ''))
      }
      const match = RegExp(valueExtractor).exec(value)
      return (match && match[0]) || value
    }
    return value
  }

  const compare = (nodeValue, condition, value) => {
    Logger.debug('\t\t\t\t\t Addon >> compare')
    if (/than/gi.test(condition) && (Number.isNaN(Number(nodeValue)) || Number.isNaN(Number(value)))) {
      throw new ConfigError('Greater || Less can only compare number', 'Wrong Comparison')
    }
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
        return Number(nodeValue) > Number(value)
      case ADDON_CONDITIONS['>= Greater Than Equals']:
        return Number(nodeValue) >= Number(value)
      case ADDON_CONDITIONS['< Less Than']:
        return Number(nodeValue) < Number(value)
      case ADDON_CONDITIONS['<= Less Than Equals']:
        return Number(nodeValue) <= Number(value)
      default:
        throw new SystemError('Addon Condition not found', `${condition} condition not found`)
    }
  }

  const start = async ({ elementFinder, value, condition, valueExtractor, ...props }, settings) => {
    Logger.debug('\t\t\t\t\t Addon >> start')
    const elements = await Common.start(elementFinder, settings)
    if (elements) {
      const nodeValue = getNodeValue(elements, valueExtractor)
      return compare(nodeValue, condition, value) || (await recheckFunc({ elementFinder, value, condition, valueExtractor, ...props }))
    }
    return false
  }

  const check = async ({ elementFinder, value, condition, ...props } = {}) => {
    Logger.debug('\t\t\t\t\t Addon >> check')
    if (elementFinder && value && condition) {
      return await start({ elementFinder, value, condition, ...props })
    }
    return true
  }

  return { check }
})(Common)

export default Addon
