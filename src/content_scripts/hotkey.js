import { Logger } from '@dhruv-techapps/core-common'

const LOGGER_LETTER = 'Hotkey'

export const Hotkey = (() => {
  const setup = (hotkey, start) => {
    Logger.colorDebug(LOGGER_LETTER, hotkey)
    document.addEventListener('keydown', ({ ctrlKey, shiftKey, altKey, code }) => {
      const key = hotkey.split('+').pop().trim()
      if (code.replace(/key/gi, '') === key) {
        if (/ctrl/gi.test(hotkey) === ctrlKey && /alt/gi.test(hotkey) === altKey && /shift/gi.test(hotkey) === shiftKey) {
          start()
        }
      }
    })
  }
  return { setup }
})()
