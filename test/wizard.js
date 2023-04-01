const config = {
  name: 'A very long text to be verified for the ellipssis anad now its fone',
  actions: [
    {
      elementFinder: '//html//body//div///html//html//body//div///html',
      value: 'MouseEvents::click',
      name: 'Hello'
    },
    {
      elementFinder: '//body',
      value: 'A very long text to be verified for the ellipssis anad now its fone'
    },
    {
      elementFinder: '//html//body//div///html//html//body//div///html',
      value: 'MouseEvents::click'
    },
    {
      elementFinder: '//body',
      value: 'A very long text to be verified for the ellipssis anad now its fone'
    },
    {
      elementFinder: '//html//body//div///html//html//body//div///html',
      value: 'MouseEvents::click'
    },
    {
      elementFinder: '//body',
      value: 'A very long text to be verified for the ellipssis anad now its fone'
    },
    {
      elementFinder: '//html//body//div///html//html//body//div///html',
      value: 'MouseEvents::click'
    },
    {
      elementFinder: '//body',
      value: 'A very long text to be verified for the ellipssis anad now its fone'
    },
    {
      elementFinder: '//html//body//div///html//html//body//div///html',
      value: 'MouseEvents::click'
    }
  ]
}
let popupContainer

fetch('./src/popup/popup.html')
  .then(r => r.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html)
    popupContainer = document.createElement('auto-clicker-autofill-popup')
    popupContainer.setAttribute('name', config.name)
    popupContainer.setAttribute('actions', JSON.stringify(config.actions))
    popupContainer.addEventListener('close', () => {
      popupContainer.remove()
    })
    popupContainer.addEventListener('remove', e => {
      // eslint-disable-next-line no-console
      config.actions.splice(e.detail.index, 1)
      popupContainer.setAttribute('actions', JSON.stringify(config.actions))
    })

    popupContainer.addEventListener('auto-generate-config', () => {
      // eslint-disable-next-line no-console
      console.log('Auto')
    })

    document.body.appendChild(popupContainer)
  })
