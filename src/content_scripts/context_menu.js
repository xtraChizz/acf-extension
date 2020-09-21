import { CONTEXT_MENU_ID } from '../common/constant'

export const ContextMenu = (() => {
  const setup = () => {
    document.addEventListener('mousedown', _mouseDownEvent, true)
  }

  const _mouseDownEvent = (event) => {
    if (event.button === 2) {
      _setxPathAndURL(_getPathTo(event.target), event)
    }
  }

  const _setxPathAndURL = (xpath, event) => {
    chrome.runtime.sendMessage({ action: CONTEXT_MENU_ID, url: event.view.document.URL, xpath: xpath })
  }

  const _getPathTo = (node) => {
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
            return _getPathTo(node.parentNode) + `/${node.tagName.toLowerCase()}[${index}]`
          }
          if (sibling.nodeType === 1 && sibling.tagName === node.tagName) {
            index++
          }
        }
      }
    }
    return ''
  }
  return { setup }
})()
