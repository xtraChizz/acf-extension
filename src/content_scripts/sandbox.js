const Sandbox = (() => {
  let sandbox

  const sendMessage = async message => {
    sandbox.contentWindow.postMessage(message, '*')
    return new Promise((resolve, reject) => {
      const listener = event => {
        const { result, error, name } = event.data
        if (event.isTrusted === false || name !== message.name) {
          return
        }
        window.removeEventListener('message', listener)
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
      window.addEventListener('message', listener)
    })
  }
  const init = () => {
    sandbox = document.createElement('iframe')
    sandbox.id = 'sandbox-iframe'
    sandbox.src = chrome.runtime.getURL('html/sandbox.html')
    sandbox.style.display = 'none'
    document.body.appendChild(sandbox)
  }
  return { init, sendMessage }
})()

export default Sandbox
