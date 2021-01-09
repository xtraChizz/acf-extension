export const Hotkey = (() => {
  const setup = (hotkey, start) => {
    // Logger.debug('\t Hotkey', hotkey)
    document.addEventListener('keydown', ({ ctrlKey, shiftKey, altKey, code }) => {
      const key = hotkey.split('+').pop().trim()
      if (code.replace(/key/ig, '') === key) {
        if (/ctrl/ig.test(hotkey) === ctrlKey && /alt/ig.test(hotkey) === altKey && /shift/ig.test(hotkey) === shiftKey) {
          start()
        }
      }
    })
  }
  return { setup }
})()
