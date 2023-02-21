/* eslint-disable no-console */
import Addon from '../../src/content_scripts/addon'
import { getInput } from '../util/html'

describe('Addon', () => {
  describe('extractValue', () => {
    test('No Extractor', () => {
      const props = { value: 'test' }
      document.body.innerHTML = getInput(props)
      const element = document.querySelector('input')
      expect(Addon.extractValue(element, element.value)).toBe(element.value)
    })
    test('Attribute', () => {
      const props = {
        id: 'test-extract-id',
        className: 'test extract class',
        placeholder: 'test-placeholder',
        'aria-label': 'test-aria-label',
        name: 'test-name',
        value: 'test',
        size: '12',
        'aria-checked': true
      }
      document.body.innerHTML = getInput(props)
      const element = document.querySelector('input')
      expect(Addon.extractValue(element, null, '@id')).toBe(props.id)
      expect(Addon.extractValue(element, null, '@class')).toBe(props.className)
      expect(Addon.extractValue(element, null, '@placeholder')).toBe(props.placeholder)
      expect(Addon.extractValue(element, null, '@aria-label')).toBe(props['aria-label'])
      expect(Addon.extractValue(element, null, '@aria-checked')).toBe(props['aria-checked'].toString())
      expect(Addon.extractValue(element, null, '@name')).toBe(props.name)
      expect(Addon.extractValue(element, null, '@value')).toBe(props.value)
      expect(Addon.extractValue(element, null, '@size')).toBe(props.size)
    })
    test('Regex', () => {
      expect(Addon.extractValue(null, 'NO REGEX')).toBe('NO REGEX')
      expect(Addon.extractValue(null, '13-Feb-2023 [00:06:36]', '\\d')).toBe('1')
      expect(Addon.extractValue(null, '13-Feb-2023 [00:06:36]', '\\d+')).toBe('13')
      expect(Addon.extractValue(null, '13-Feb-2023 [00:06:36]', '\\d+', 'g')).toBe('132023000636')
      expect(Addon.extractValue(null, '$12.23', '\\d+\\.\\d*')).toBe('12.23')
      expect(Addon.extractValue(null, '$12,000.00', '\\d+\\.?', 'g')).toBe('12000.00')
    })
  })
})
