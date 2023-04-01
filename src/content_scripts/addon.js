import { ADDON_CONDITIONS, RECHECK_OPTIONS } from '@dhruv-techapps/acf-common'
import { ActionService } from '@dhruv-techapps/core-services'
import { Logger } from '@dhruv-techapps/core-common'
import { wait } from './util'
import { ConfigError, SystemError } from './error'
import Common from './common'
import { RADIO_CHECKBOX_NODE_NAME, SELECT_TEXTAREA_NODE_NAME } from '../common/constant'

const LOGGER_LETTER = 'Addon'

const Addon = (() => {
  const recheckFunc = async ({ nodeValue, elementFinder, value, condition, recheck, recheckInterval, recheckOption, valueExtractor, valueExtractorFlags }, settings, batchRepeat) => {
    if (recheck > 0 || recheck < -1) {
      recheck -= 1
      ActionService.setBadgeBackgroundColor(chrome.runtime.id, { color: [13, 202, 240, 1] })
      ActionService.setBadgeText(chrome.runtime.id, { text: 'Recheck' })
      await wait(recheckInterval, `${LOGGER_LETTER} Recheck`, recheck, '<interval>')
      // eslint-disable-next-line no-use-before-define
      return await start({ elementFinder, value, condition, recheck, recheckInterval, recheckOption, valueExtractor, valueExtractorFlags }, settings, batchRepeat)
    }
    // eslint-disable-next-line no-console
    console.table([{ elementFinder, value, condition, nodeValue }])
    if (recheckOption === RECHECK_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        window.location.reload()
      } else {
        window.addEventListener('load', () => {
          window.location.reload()
        })
      }
    } else if (recheckOption === RECHECK_OPTIONS.STOP) {
      throw new ConfigError(`'${nodeValue}' ${condition} '${value}'`, "Addon didn't matched")
    }
    Logger.colorInfo('RecheckOption', recheckOption)
    return false
  }

  const extractValue = (element, value, valueExtractor, valueExtractorFlags = '') => {
    if (!valueExtractor) {
      return value
    }
    if (/^@\w+(-\w+)?$/.test(valueExtractor)) {
      return element.getAttribute(valueExtractor.replace('@', ''))
    }
    const matches = value.match(RegExp(valueExtractor, valueExtractorFlags))
    return (matches && matches.join('')) || value
  }

  const getNodeValue = (elements, valueExtractor, valueExtractorFlags) => {
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
    value = extractValue(element, value, valueExtractor, valueExtractorFlags)
    Logger.colorDebug('GetNodeValue', value)
    return value
  }

  const compare = (nodeValue, condition, value) => {
    Logger.colorDebug('Compare', { nodeValue, condition, value })
    if (/than/gi.test(condition) && (Number.isNaN(Number(nodeValue)) || Number.isNaN(Number(value)))) {
      throw new ConfigError(`Greater || Less can only compare number '${nodeValue}' '${value}'`, 'Wrong Comparison')
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

  const start = async ({ elementFinder, value, condition, valueExtractor, valueExtractorFlags, ...props }, settings, batchRepeat) => {
    try {
      Logger.colorDebug('Start', { elementFinder, value, condition, valueExtractor, valueExtractorFlags })
      let nodeValue
      if (/^Func::/gi.test(elementFinder)) {
        nodeValue = await Common.sandboxEval(elementFinder.replace(/^Func::/gi, ''))
      } else {
        elementFinder = elementFinder.replaceAll('<batchRepeat>', batchRepeat)
        const elements = await Common.start(elementFinder, settings)
        if (elements) {
          nodeValue = getNodeValue(elements, valueExtractor, valueExtractorFlags)
        }
      }
      if (nodeValue !== undefined) {
        value = value.replaceAll('<batchRepeat>', batchRepeat)
        const result = compare(nodeValue, condition, value) || (await recheckFunc({ nodeValue, elementFinder, value, condition, valueExtractor, valueExtractorFlags, ...props }, settings, batchRepeat))
        Logger.colorDebug('Compare Result', result)
        Logger.groupEnd(LOGGER_LETTER)
        return result
      }
      Logger.groupEnd(LOGGER_LETTER)
      return false
    } catch (error) {
      Logger.groupEnd(LOGGER_LETTER)
      throw error
    }
  }

  const check = async (actionSettings, batchRepeat, { elementFinder, value, condition, ...props } = {}) => {
    if (elementFinder && value && condition) {
      Logger.groupCollapsed(LOGGER_LETTER)
      return await start({ elementFinder, value, condition, ...props }, actionSettings, batchRepeat)
    }
    return true
  }

  return { check, extractValue }
})()

export default Addon
