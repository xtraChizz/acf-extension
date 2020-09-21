export const sleep = async (msec) => {
  return new Promise(resolve => setTimeout(resolve, msec))
}
export const wait = async (initWait) => {
  if (initWait) {
    if (/\d+e\d+/.test(initWait.toString())) {
      const range = initWait.toString().split('e')
      await sleep((Math.floor(Math.random() * 1000 * parseInt(range[1])) + parseInt(range[0]) * 1000))
    } else {
      await sleep(Number(initWait) * 1000)
    }
  }
}
export const FORM_ELEMENT_NODENAME = /^(select|textarea|input|button|label|option|optgroup|fieldset|output)$/gi
export const FORM_CLEAR_ELEMENT_NODENAME = /^(select|textarea|input)$/gi
export const SELECT_TEXTAREA_NODENAME = /^(select|textarea)$/gi
export const RADIO_CHECKBOX_NODENAME = /^(radio|checkbox)$/gi
