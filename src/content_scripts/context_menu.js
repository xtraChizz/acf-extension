import { Runtime } from '@dhruv-techapps/core-extension'
import { CONTEXT_MENU_ID } from '../background'

export class ContextMenuSetup {
  constructor () {
    document.addEventListener('mousedown', this.mouseDownEvent, true)
  }

  mouseDownEvent (event) {
    if (event.button === 2) {
      this.setxPathAndURL(this.getPathTo(event.target), event)
    }
  }

  setxPathAndURL (xpath, event) {
    Runtime.sendMessage({ action: CONTEXT_MENU_ID, url: event.view.document.URL, xpath: xpath })
  }

  getPathTo (node) {
    if (node) {
      if (node.id !== '') {
        return `//*[@id="${node.id}"]`
      }
      if (node === document.body) {
        return `html/${node.tagName.toLowerCase()}`
      }
      var index = 1
      var siblings = node.parentNode.childNodes
      if (siblings) {
        for (var i = 0; i < siblings.length; i++) {
          var sibling = siblings[i]
          if (sibling === node) {
            return this.getPathTo(node.parentNode) + `/${node.tagName.toLowerCase()}[${index}]`
          }
          if (sibling.nodeType === 1 && sibling.tagName === node.tagName) {
            index++
          }
        }
      }
    }
    return ''
  }
}
