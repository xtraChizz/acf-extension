import Common from './common'

const SCROLL_COORDINATES = ['Top', 'Bottom', 'Left', 'Right', 'TopLeft', 'BottomLeft', 'BottomRight', 'TopRight']

export default class ScrollTo extends Common {
  constructor (nodes, xpath, value) {
    super()
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      this.xpath = xpath
      try {
        const object = value.split('::')[1] || 'xpath'
        if (SCROLL_COORDINATES.indexOf(object) !== -1) {
          this.scrollToCoordinates(object)
        } else if (/xpath/gi.test(object)) {
          this.scrollToNode(nodes)
        } else {
          this.error(`Scroll to ${object} is not configrued`)
        }
      } catch (error) {
        this.error(error)
      }
    })
  }

  scrollToCoordinates (axis) {
    let xAxis = 0; let yAxis = 0
    if (axis.indexOf('Right') !== -1) {
      xAxis = document.body.scrollWidth
    }
    if (axis.indexOf('Bottom') !== -1) {
      yAxis = document.body.scrollHeight
    }
    window.scrollTo(xAxis, yAxis)
    this.success(`Scrolled to ${xAxis}, ${yAxis} Coordinates Successfully!`)
  }

  scrollToNode (nodes) {
    nodes.snapshotItem(0).scrollIntoView()
    this.success(`Scrolled to XPath: ${this.xpath} Successfully!`)
  }
}
