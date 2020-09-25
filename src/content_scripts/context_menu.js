import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { StorageService } from '@dhruv-techapps/core-common'

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
    StorageService.setItem(LOCAL_STORAGE_KEY.URL, event.view.document.URL)
    StorageService.setItem(LOCAL_STORAGE_KEY.XPATH, xpath)
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
