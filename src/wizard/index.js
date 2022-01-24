const { CONTEXT_MENU_FORM_ID } = require('../common/constant')
const { ElementGenerator } = require('./element')
const { FormGenerator } = require('./form')

chrome.extension.onMessage.addListener(msg => {
  if (msg.action === CONTEXT_MENU_FORM_ID) {
    FormGenerator.setup()
  }
})
ElementGenerator.setup()
