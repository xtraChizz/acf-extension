import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { xPath } from './dom-path'

export const IndividualField = (() => {
  const mouseDownEvent = event => {
    if (event.button === 2) {
      const elementFinder = xPath(event.target, true)
      chrome.storage.local.set({ [LOCAL_STORAGE_KEY.URL]: event.view.document.URL, [LOCAL_STORAGE_KEY.XPATH]: elementFinder })
    }
  }

  const setup = () => {
    document.addEventListener('mousedown', mouseDownEvent, true)
  }

  return { setup }
})()
