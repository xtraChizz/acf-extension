import { defaultAction } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
import { xPath } from './dom-path'
import { RADIO_CHECKBOX_NODE_NAME } from '../common/constant'

export const Listener = (() => {
  const inputListener = async element =>
    new Promise(resolve => {
      Logger.log(element, 'input')
      element.addEventListener('blur', e => resolve(e.target.value), { once: true, passive: true })
    })

  const optionListener = async element =>
    new Promise(resolve => {
      Logger.log(element, 'option')
      element.addEventListener(
        'click',
        e => {
          let value = '/option['
          const option = e.target.querySelector('option:checked')
          option.getAttributeNames().forEach((attr, index) => {
            if (index) {
              value += ' and '
            }
            value += `@${attr}="${option.getAttribute(attr)}"`
          })
          value += ']'
          resolve(value)
        },
        { once: true, passive: true }
      )
    })

  const check = async element => {
    let elementFinder = xPath(element, true)
    let name = element.name || element.id || element.placeholder || element.getAttribute('for') || (element.type && `${element.type}-${element.value}`) || ''
    let { value } = defaultAction
    if (element.nodeName === 'TEXTAREA' || (element.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODE_NAME.test(element.type)) || (element.nodeName === 'DIV' && element.isContentEditable)) {
      value = await inputListener(element)
      if (!value) {
        return {}
      }
    } else if (element.nodeName === 'INPUT' && RADIO_CHECKBOX_NODE_NAME.test(element.type)) {
      value = await inputListener(element)
    } else if (element.nodeName === 'SELECT') {
      elementFinder += await optionListener(element)
      value = true
    } else if (element.nodeName === 'BUTTON' || element.nodeName === 'A') {
      name = element.innerText
    } else {
      return {}
    }
    return { ...defaultAction, name, elementFinder, value }
  }

  return { check }
})()
