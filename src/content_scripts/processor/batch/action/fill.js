import Common from './common'
import { RADIO_CHECKBOX_NODENAME } from './../../../common/regex'
import { ClickEvents } from './event'

export default class Fill extends Common {
  process (value) {
    value = this.checkEmptyValue(value)
    this.loopNodes(value)
    return `${value} filled successfully!`
  }

  checkEmptyValue (value) {
    return value === '::empty' ? '' : value
  }

  loopNodes (value) {
    let i = 0
    while (i < this._nodes.snapshotLength) {
      const node = this._nodes.snapshotItem(i++)
      this.checkNode(node, value)
    }
  }

  checkNode (node, value) {
    if (node) {
      if (node.nodeName === 'SELECT' || node.nodeName === 'TEXTAREA' || (node.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODENAME.test(node.type))) {
        node.value = value
        return this.dispatchEvent(node)
      } else {
        return new ClickEvents(node, 'ClickEvents::click').catch(this.error.bind(this))
      }
    }
  }

  dispatchEvent (node) {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('change', false, true)
    node.dispatchEvent(event)
    node.focus()
  }
}
