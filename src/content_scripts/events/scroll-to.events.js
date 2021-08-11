import { Logger } from '@dhruv-techapps/core-common'
import CommonEvents from './common.events'

const SCROLL_COORDINATES = ['Top', 'Bottom', 'Left', 'Right', 'TopLeft', 'BottomLeft', 'BottomRight', 'TopRight', 'XPath']

export const ScrollToEvents = (() => {
  const scrollToCoordinates = axis => {
    let xAxis = 0
    let yAxis = 0
    if (axis.indexOf('Right') !== -1) {
      xAxis = document.body.scrollWidth
    }
    if (axis.indexOf('Bottom') !== -1) {
      yAxis = document.body.scrollHeight
    }
    window.scrollTo(xAxis, yAxis)
  }

  const scrollToElement = elements => {
    elements[0].scrollIntoView()
  }

  const start = (elements, value) => {
    Logger.debug('\t\t\t\t\t ScrollToEvents >> start')
    if (/xpath/gi.test(value)) {
      scrollToElement(elements)
    } else {
      const scrollCoordinates = CommonEvents.getVerifiedEvents(SCROLL_COORDINATES, value)[0]
      scrollToCoordinates(scrollCoordinates)
    }
  }

  return { start }
})()
