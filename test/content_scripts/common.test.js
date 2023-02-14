/* eslint-disable no-console */
import Common from '../../src/content_scripts/common'

describe('Common.stringFunction', () => {
  test('Date Function', () => {
    expect(Common.stringFunction('new Date().getHours()')).toBe(new Date().getHours())
  })
  test('Window', () => {
    expect(Common.stringFunction('location.href', { location: { href: 'Dharmesh' } })).toBe('Dharmesh')
  })
})
