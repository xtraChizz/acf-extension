import { defaultAction } from '@dhruv-techapps/acf-common'
import { BUTTON_NODE_NAME, RADIO_CHECKBOX_NODE_NAME } from '../common/constant'
import { xPath } from './dom-path'

export const WizardElementUtil = (() => {
  const radioCheckbox = element => element.checked

  const select = element => {
    const option = element.querySelector('option:checked')
    if (option.index === 0) {
      return {}
    }
    return { elementValue: option.innerText, optionValue: `/option[${option.index + 1}]` }
  }

  const inputListener = async element =>
    new Promise(resolve => {
      element.addEventListener('blur', e => resolve(e.target.value || null), { once: true, passive: true })
    })

  const optionListener = async element =>
    new Promise(resolve => {
      element.addEventListener('blur', e => resolve(select(e.target)), { once: true, passive: true })
    })

  const clearXpath = xpath => {
    if (xpath.includes('/option')) {
      xpath = xpath.replace(/\/option.*/, '')
    }
    return xpath
  }

  const check = async (element, listener = false) => {
    const elementFinder = xPath(element, true)
    const { name: elementName, id, placeholder, type } = element
    const name = elementName || id || placeholder || type || element.getAttribute('for') || ''
    const action = { ...defaultAction, name, elementFinder, elementType: element.type }

    // Textarea && Editable Content
    if (element.nodeName === 'TEXTAREA' || element.isContentEditable) {
      const value = listener ? await inputListener(element) : element.value
      if (!value) {
        return {}
      }
      return { ...action, value }
    }

    // Input Element
    if (element.nodeName === 'INPUT') {
      if (RADIO_CHECKBOX_NODE_NAME.test(element.type)) {
        const checked = radioCheckbox(element)
        return { ...action, elementFinder, checked, elementValue: element.value }
      }

      let value
      let elementValue
      if (BUTTON_NODE_NAME.test(element.type)) {
        if (listener) {
          value = ''
        }
        elementValue = element.innerText
      } else {
        value = listener ? await inputListener(element) : element.value || null
      }

      if (value !== null && value !== undefined) {
        return { ...action, elementFinder, value, elementValue }
      }
      return {}
    }

    // Button
    if (element.nodeName === 'BUTTON' && listener) {
      return { ...action, elementFinder, value: '', elementValue: element.innerText }
    }

    // Select Dropdown
    if (element.nodeName === 'SELECT') {
      const { elementValue, optionValue } = listener ? await optionListener(element) : select(element)
      if (optionValue) {
        return { ...action, xpath: elementFinder, elementFinder: elementFinder + optionValue, value: true, elementValue }
      }
    }
    return {}
  }

  return { clearXpath, check }
})()
