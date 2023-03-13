/* eslint-disable no-console */
import Common from '../../src/content_scripts/common'

describe('Common.stringFunction', () => {
  test('Date Function', () => {
    expect(Common.stringFunction('new Date().getHours()')).toBe(new Date().getHours())
  })
  test('Window', () => {
    expect(Common.stringFunction('location.href', { location: { href: 'Dharmesh' } })).toBe('Dharmesh')
  })
  describe('String Operation', () => {
    const sentence = 'The quick brown fox jumps over the lazy dog.'
    test('Blank', () => {
      expect(Common.stringFunction('', sentence)).toBe(sentence)
    })
    test('at', () => {
      expect(Common.stringFunction('at(5)', sentence)).toBe('u')
      expect(Common.stringFunction('at(-4)', sentence)).toBe('d')
    })
    test('charAt', () => {
      expect(Common.stringFunction('charAt(4)', sentence)).toBe('q')
    })
    test('concat', () => {
      const str1 = 'Hello'
      expect(Common.stringFunction('concat(" ", "World")', str1)).toBe('Hello World')
      expect(Common.stringFunction('concat(" ","World")', str1)).toBe('Hello World')
      expect(Common.stringFunction('concat(", ", "Hello")', str1)).toBe('Hello, Hello')
      expect(Common.stringFunction("concat(', ', 'Hello')", str1)).toBe('Hello, Hello')
    })
    test.skip('match', () => {
      expect(Common.stringFunction('match(/[A-Z]/g)', sentence)).toBe(['T', 'I'])
      expect(Common.stringFunction('match(/[A-Z]/g).join("")', sentence)).toBe('TI')
      expect(Common.stringFunction('match(/[A-Z]/g).join(",")', sentence)).toBe('T,I')
    })
    test('replace', () => {
      const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?'
      expect(Common.stringFunction('replace("dog", "monkey")', p)).toBe('The quick brown fox jumps over the lazy monkey. If the dog reacted, was it really lazy?')
      // expect(Common.stringFunction('replace(/Dog/i, "ferret")', p)).toBe('The quick brown fox jumps over the lazy ferret. If the dog reacted, was it really lazy?')
    })
    test('replaceAll', () => {
      const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?'
      expect(Common.stringFunction('replaceAll("dog", "monkey")', p)).toBe('The quick brown fox jumps over the lazy monkey. If the monkey reacted, was it really lazy?')
      // expect(Common.stringFunction('replaceAll(/Dog/i, "ferret")', p)).toBe('The quick brown fox jumps over the lazy ferret. If the ferret reacted, was it really lazy?')
    })
    test('slice', () => {
      expect(Common.stringFunction('slice(31)', sentence)).toBe('the lazy dog.')
      expect(Common.stringFunction('slice(4,19)', sentence)).toBe('quick brown fox')
      expect(Common.stringFunction('slice(-4)', sentence)).toBe('dog.')
      expect(Common.stringFunction('slice(-9,-5)', sentence)).toBe('lazy')
    })
    test.skip('split', () => {
      expect(Common.stringFunction('split(" ")[3]', sentence)).toBe('fox')
      expect(Common.stringFunction('split("")[3]', sentence)).toBe('k')
    })
    test('substring', () => {
      expect(Common.stringFunction('substring(1, 3)', 'Dhruv')).toBe('hr')
      expect(Common.stringFunction('substring(2)', 'Dhruv')).toBe('ruv')
    })
    test('toLowerCase', () => {
      expect(Common.stringFunction('toLowerCase()', sentence)).toBe('the quick brown fox jumps over the lazy dog.')
    })
    test('toUpperCase', () => {
      expect(Common.stringFunction('toUpperCase()', sentence)).toBe('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.')
    })
    test('trim', () => {
      const greeting = '   Hello world!   '
      expect(Common.stringFunction('trim()', greeting)).toBe('Hello world!')
    })
    test('trimStart', () => {
      const greeting = '   Hello world!   '
      expect(Common.stringFunction('trimStart()', greeting)).toBe('Hello world!   ')
    })
    test('trimEnd', () => {
      const greeting = '   Hello world!   '
      expect(Common.stringFunction('trimEnd()', greeting)).toBe('   Hello world!')
    })
  })
})
