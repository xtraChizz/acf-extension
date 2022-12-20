import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'

export const ElementGenerator = (() => {
  const setXPathAndURL = (xpath, event) => {
    chrome.storage.local.set({ [LOCAL_STORAGE_KEY.URL]: event.view.document.URL })
    chrome.storage.local.set({ [LOCAL_STORAGE_KEY.XPATH]: xpath })
  }

  const getPathTo = node => {
    if (node) {
      if (node.id !== '') {
        return `//*[@id="${node.id}"]`
      }
      if (node === document.body) {
        return `/html/${node.tagName.toLowerCase()}`
      }
      let index = 1
      const siblings = node.parentNode.childNodes
      if (siblings) {
        for (let i = 0; i < siblings.length; i += 1) {
          const sibling = siblings[i]
          if (sibling === node) {
            return `${getPathTo(node.parentNode)}/${node.tagName.toLowerCase()}[${index}]`
          }
          if (sibling.nodeType === 1 && sibling.tagName === node.tagName) {
            index += 1
          }
        }
      }
    }
    return ''
  }
  const mouseDownEvent = event => {
    if (event.button === 2) {
      setXPathAndURL(getPathTo(event.target), event)
    }
  }
  const setup = () => {
    document.addEventListener('mousedown', mouseDownEvent, true)
  }

  return { setup }
})()
