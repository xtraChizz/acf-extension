import Common from './common'
import CustomError from '../../../error/custom-error'
import { RADIO_CHECKBOX_NODENAME, SELECT_TEXTAREA_NODENAME } from '../../../common/regex'
import { RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
export default class Addon extends Common {
  process (data) {
    this.condition = data.condition
    this.value = data.value
    if (this.condition && this.value) {
      return this.check()
    } else {
      return `ADDON: condition:${this.condition} value:${this.value}`
    }
  }

  check () {
    let i = 0
    while (i < this._nodes.snapshotLength) {
      const node = this._nodes.snapshotItem(i++)
      let value
      if (node) {
        if (SELECT_TEXTAREA_NODENAME.test(node.nodeName)) {
          value = node.value
        } else if (node.nodeName === 'INPUT') {
          if (RADIO_CHECKBOX_NODENAME.test(node.type)) {
            return node.checked ? 'true' : this.condition === 'false'
          } else {
            value = node.value
          }
        } else {
          value = node.innerText
        }
        if (this.checkCondition(value)) {
          return `Condition Success! xPathValue:${value} ${this.condition} value:${this.value}`
        } else if (this._settings.retryOption === RETRY_OPTIONS.SKIP) {
          return 'Addon Skipped!'
        } else {
          throw new CustomError('Condition Failed!', `xPathValue:${value} ~ ${this.condition} ~ value:${this.value}`, Addon.name)
        }
      }
    }
  }

  checkCondition (value) {
    switch (this.condition) {
      case 'Equals':
        return new RegExp(`^${this.value}$`, 'gi').test(value)
      case 'NotEquals':
        return !new RegExp(`^${this.value}$`, 'gi').test(value)
      case 'Contains':
        return new RegExp(`${this.value}`, 'gi').test(value)
      case 'GreaterThan':
        return value > this.value
      case 'LessThan':
        return value < this.value
      case 'GreaterThanEquals':
        return value >= this.value
      case 'LessThanEquals':
        return value <= this.value
      default:
        throw new CustomError('Condition not found', `${this.condition} condition not found`, Addon.name)
    }
  }
}
