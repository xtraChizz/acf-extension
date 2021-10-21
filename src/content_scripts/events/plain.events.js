import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODE_NAME } from '../util'
import CommonEvents from './common.events'

const DEFAULT_EVENT = ['mouseover', 'mousedown', 'mouseup', 'click']
const CHANGE_EVENT = ['input', 'change']
const CAP_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SMALL_ALPHA = 'abcdefghijklmnopqrstuvwxyz'
const SPECIAL_CHAR = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
const NUM = '0123456789'

export const PlainEvents = (() => {
  const checkEmptyValue = value => (value === '::empty' ? '' : value)

  const checkRandomValue = value => {
    const RANDOM_REGEX = /<random(\[.+\])?(\{(\d+),?(\d+)?\})?>/i
    if (RANDOM_REGEX.test(value)) {
      const [, range, , start = 6, end] = value.match(RANDOM_REGEX)
      Logger.log(range, start, end, value, value.match(RANDOM_REGEX))
      let characters
      switch (range) {
        case '[A-Z]':
          characters = CAP_ALPHA
          break
        case '[a-z]':
          characters = SMALL_ALPHA
          break
        case '[^a-z]':
          characters = CAP_ALPHA + SPECIAL_CHAR + NUM
          break
        case '[^A-Z]':
          characters = SMALL_ALPHA + SPECIAL_CHAR + NUM
          break
        case '[\\d]':
          characters = NUM
          break
        case '[\\D]':
          characters = CAP_ALPHA + SMALL_ALPHA
          break
        case '[\\w]':
          characters = `${CAP_ALPHA + SMALL_ALPHA + NUM}_`
          break
        case '[\\W]':
          characters = SPECIAL_CHAR
          break
        case '[.]':
          characters = CAP_ALPHA + SMALL_ALPHA + SPECIAL_CHAR + NUM
          break
        default:
          characters = range?.match(/\[(.+)\]/)[1] || CAP_ALPHA + SMALL_ALPHA + SPECIAL_CHAR + NUM
      }
      const charactersLength = characters.length
      let result = ''
      let length = start
      if (end) {
        length = Math.floor(Math.random() * Number(end)) + Number(start)
      }
      Logger.log(characters, start, end)
      for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    }
    return value
  }

  const checkNode = (element, value) => {
    if (element.nodeName === 'SELECT' || element.nodeName === 'TEXTAREA' || (element.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value
      element.dispatchEvent(CommonEvents.getFillEvent())
    } else if (element.nodeName === 'DIV' && element.isContentEditable) {
      element.textContent = value
    } else if (element.nodeName === 'OPTION') {
      element.selected = true
    } else {
      DEFAULT_EVENT.forEach(event => {
        element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
      })
    }
    CHANGE_EVENT.forEach(event => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
    })
    element.focus()
  }

  const start = (elements, value) => {
    Logger.debug('\t\t\t\t\t PlainEvents >> start')
    value = checkEmptyValue(value)
    value = checkRandomValue(value)
    CommonEvents.loopElements(elements, value, checkNode)
  }

  return { start }
})()
