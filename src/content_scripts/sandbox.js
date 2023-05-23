import { SANDBOX_INITIALIZED } from '../common/constant'

const Sandbox = (() => {
  let sandbox

  const add = () => {
    sandbox = document.createElement('iframe')
    sandbox.id = 'sandbox-iframe'
    sandbox.src = chrome.runtime.getURL('html/sandbox.html')
    sandbox.style.display = 'none'
    document.body.appendChild(sandbox)
  }

  const remove = () => {
    document.body.removeChild(sandbox)
  }

  const sendMessage = async message => {
    add()
    return new Promise((resolve, reject) => {
      const listener = event => {
        const { result, error, name, type } = event.data
        if (event.isTrusted === false) {
          return
        }
        if (type === SANDBOX_INITIALIZED) {
          sandbox.contentWindow.postMessage(message, '*')
          return
        }
        if (name === message.name) {
          remove()
          window.removeEventListener('message', listener)
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      }
      window.addEventListener('message', listener)
    })
  }

  return { sendMessage }
})()

export default Sandbox
