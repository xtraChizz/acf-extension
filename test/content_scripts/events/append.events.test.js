import { AppendEvents } from '../../../src/content_scripts/events/append.events'
import { getEditableDiv, getInputs, getTextarea } from '../../util/html'

jest.mock('../../../src/content_scripts/common')

describe('Append Events', () => {
  test('input', () => {
    const count = 2
    const props = { value: 'Append' }
    document.body.innerHTML = getInputs(count, props)
    const elements = document.querySelectorAll('input')
    const value = 'Hello'
    AppendEvents.start(elements, `append::${value}`)
    elements.forEach(element => {
      expect(element.value).toEqual(props.value + value)
    })
  })
  test('textarea', () => {
    const props = { value: 'Append' }
    document.body.innerHTML = getTextarea(props)
    const textarea = document.querySelectorAll('textarea')
    const value = 'Hello'
    AppendEvents.start(textarea, `append::${value}`)
    expect(textarea[0].value).toEqual(props.value + value)
  })
  test.skip('div', () => {
    const props = { innerHTML: 'Append' }
    document.body.innerHTML = getEditableDiv(props)
    const div = document.querySelectorAll('div')
    div[0].contentEditable = 'true'
    const value = 'Hello'
    AppendEvents.start(div, `append::${value}`)
    expect(div[0].innerHTML).toEqual(props.innerHTML + value)
  })
})
