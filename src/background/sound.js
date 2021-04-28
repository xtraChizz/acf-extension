export default class Sound {
  processPortMessage() {
    try {
      new Audio(chrome.runtime.getURL('./sounds/Bulb.ogg')).play()
      return {}
    } catch (error) {
      return { error }
    }
  }
}
