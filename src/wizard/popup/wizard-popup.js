export class AutoClickerAutoFillPopup extends HTMLElement {
  autoHideCount = 3

  static get observedAttributes() {
    return ['actions']
  }

  constructor() {
    super()
    const template = document.getElementById('auto-clicker-autofill-popup').content
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.cloneNode(true))
    this.attachEventListener()
  }

  attachEventListener() {
    this.shadowRoot.addEventListener('click', e => {
      e.stopPropagation()
      const element = e.composedPath()[0]
      if (element.nodeName === 'BUTTON') {
        if (element.hasAttribute('auto-generate-config')) {
          this.dispatchEvent(new CustomEvent('auto-generate-config'))
        }
      }
    })

    // Close modal popup
    this.shadowRoot.querySelector('[data-bs-dismiss="modal"]').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('close'))
    })
    this.expandCollapse()
  }

  setHoverEvent(tbody) {
    tbody.querySelectorAll('tr').forEach(element => {
      element.addEventListener('mouseenter', e => {
        e.stopPropagation()
        const { title } = e.currentTarget
        this.dispatchEvent(new CustomEvent('enter', { detail: { xpath: title } }))
      })
      element.addEventListener('mouseleave', e => {
        e.stopPropagation()
        const { title } = e.currentTarget
        this.dispatchEvent(new CustomEvent('leave', { detail: { xpath: title } }))
      })
      element.addEventListener('click', e => {
        e.stopPropagation()
        const { title } = e.currentTarget
        this.dispatchEvent(new CustomEvent('element-focus', { detail: { xpath: title } }))
      })
      // Remove button
      element.querySelector('button').addEventListener('click', e => {
        const index = e.currentTarget.getAttribute('index')
        this.dispatchEvent(new CustomEvent('remove', { detail: { index } }))
      })
    })
  }

  expandCollapse() {
    const collapse = this.shadowRoot.querySelector('[aria-label="collapse"]')
    collapse.addEventListener('click', () => {
      collapse.classList.toggle('expand')
      this.shadowRoot.querySelectorAll('[id^="collapse"]').forEach(e => e.classList.toggle('collapse'))
    })
  }

  connectedCallback() {
    const name = this.getAttribute('name')
    const settings = this.getAttribute('settings')
    this.shadowRoot.querySelector('#settings').setAttribute('href', settings)
    if (name) {
      this.shadowRoot.querySelector('.modal-title').innerText = name
    }
  }

  attributeChangedCallback() {
    this.crateTable()
  }

  autoHide() {
    this.autoHideCount -= 1
    if (this.autoHideCount === 0) {
      this.shadowRoot.querySelector('[aria-label="collapse"]').click()
    }
  }

  crateTable() {
    const actions = JSON.parse(this.getAttribute('actions'))
    if (!actions || actions.length === 0) {
      this.shadowRoot.querySelector('slot[name="actions"]').hidden = true
      this.shadowRoot.querySelector('slot[name="no-actions"]').hidden = false
    } else {
      this.autoHide()
      this.shadowRoot.querySelector('slot[name="actions"]').hidden = false
      this.shadowRoot.querySelector('slot[name="no-actions"]').hidden = true
      const tbody = this.shadowRoot.querySelector('tbody')
      tbody.innerHTML = ''
      actions.forEach(({ name, value, elementFinder, elementValue }, index) => {
        const tr = document.getElementById('auto-clicker-autofill-popup-tr').content.cloneNode(true)
        const tds = tr.querySelectorAll('td div')
        if (elementValue) {
          tds[0].innerText = `${name}::${elementValue}`
        } else {
          tds[0].innerText = name || elementFinder
        }
        tr.children[0].setAttribute('title', elementFinder)
        tds[1].innerHTML = value || '<span class="badge text-bg-secondary">Click</span>'
        tr.querySelector('button').setAttribute('index', index)
        tbody.appendChild(tr)
      })
      this.setHoverEvent(tbody)
    }
  }
}

window.customElements.define('auto-clicker-autofill-popup', AutoClickerAutoFillPopup)
