import { Logger } from '@dhruv-techapps/core-common'
import CommonEvents from './common.events'

const SCROLL_COORDINATES = ['Top', 'Bottom', 'Left', 'Right', 'TopLeft', 'BottomLeft', 'BottomRight', 'TopRight', 'XPath']

export const ScrollToEvents = ((CommonEvents) => {
  const start = (nodes, value) => {
    Logger.log('ScrollToEvents - start')
    if (/xpath/gi.test(value)) {
      _scrollToNode(nodes)
    } else {
      const scrollCoordinates = CommonEvents.getVerifiedEvents(SCROLL_COORDINATES, value)[0]
      _scrollToCoordinates(scrollCoordinates)
    }
  }

  const _scrollToCoordinates = (axis) => {
    let xAxis = 0; let yAxis = 0
    if (axis.indexOf('Right') !== -1) {
      xAxis = document.body.scrollWidth
    }
    if (axis.indexOf('Bottom') !== -1) {
      yAxis = document.body.scrollHeight
    }
    window.scrollTo(xAxis, yAxis)
  }

  const _scrollToNode = (nodes) => {
    nodes.snapshotItem(0).scrollIntoView()
  }
  return { start }
})(CommonEvents)
