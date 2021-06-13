import CommonEvents from './common.events'

export const ClassEvents = (() => {
  const execCommand = (element, value) => {
    const [, action, name, prop] = value.split('::')
    if (action === 'add') {
      element.classList.add(name)
    } else if (action === 'remove') {
      element.classList.remove(name)
    } else if (action === 'clear') {
      element.className = ''
    } else if (action === 'replace') {
      element.className.replace(new RegExp(`^${name}$`, 'gi'), prop)
    }
  }

  const start = (elements, value) => {
    // Logger.debug('\t\t\t\t\t WindowCommandEvents >> start')
    CommonEvents.loopElements(elements, value, execCommand)
  }
  return { start }
})()
