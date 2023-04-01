import Common from '../../src/content_scripts/common'
import Sandbox from '../../src/content_scripts/sandbox'

beforeAll(() => {
  Sandbox.init()
})

describe('Common.sandboxEval', () => {
  test('Date Function', () => {
    Common.sandboxEval('new Date().getHours()').then(result => {
      expect(result).toBe(new Date().getHours())
    })
  })
  test('Window', () => {
    Common.sandboxEval('location.href', { location: { href: 'Dharmesh' } }).then(result => {
      expect(result).toBe('Dharmesh')
    })
  })
  describe('String Operation', () => {
    const sentence = 'The quick brown fox jumps over the lazy dog.'
    test('Blank', () => {
      Common.sandboxEval('', sentence).then(result => {
        expect(result).toBe(sentence)
      })
    })
    test('at', () => {
      Common.sandboxEval('at(5)', sentence).then(result => {
        expect(result).toBe('u')
      })
      Common.sandboxEval('at(-4)', sentence).then(result => {
        expect(result).toBe('d')
      })
    })
    test('charAt', () => {
      Common.sandboxEval('charAt(4)', sentence).then(result => {
        expect(result).toBe('q')
      })
    })
    test('concat', () => {
      const str1 = 'Hello'
      Common.sandboxEval('concat(" ", "World")', str1).then(result => {
        expect(result).toBe('Hello World')
      })
      Common.sandboxEval('concat(" ","World")', str1).then(result => {
        expect(result).toBe('Hello World')
      })
      Common.sandboxEval('concat(", ", "Hello")', str1).then(result => {
        expect(result).toBe('Hello, Hello')
      })

      Common.sandboxEval("concat(', ', 'Hello')", str1).then(result => {
        expect(result).toBe('Hello, Hello')
      })
    })
    test('match', () => {
      Common.sandboxEval('match(/[A-Z]/g)', sentence).then(result => {
        expect(result).toBe(['T', 'I'])
      })
      Common.sandboxEval('match(/[A-Z]/g).join("")', sentence).then(result => {
        expect(result).toBe('TI')
      })
      Common.sandboxEval('match(/[A-Z]/g).join(",")', sentence).then(result => {
        expect(result).toBe('T,I')
      })
    })
    test('replace', () => {
      const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?'
      Common.sandboxEval('replace("dog", "monkey")', p).then(result => {
        expect(result).toBe('The quick brown fox jumps over the lazy monkey. If the dog reacted, was it really lazy?')
      })
      Common.sandboxEval('replace(/Dog/i, "ferret")', p).then(result => {
        expect(result).toBe('The quick brown fox jumps over the lazy ferret. If the dog reacted, was it really lazy?')
      })
    })
    test('replaceAll', () => {
      const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?'
      Common.sandboxEval('replaceAll("dog", "monkey")', p).then(result => {
        expect(result).toBe('The quick brown fox jumps over the lazy monkey. If the monkey reacted, was it really lazy?')
      })

      Common.sandboxEval('replaceAll(/Dog/i, "ferret")', p).then(result => {
        expect(result).toBe('The quick brown fox jumps over the lazy ferret. If the ferret reacted, was it really lazy?')
      })
    })
    test('slice', () => {
      Common.sandboxEval('slice(31)', sentence).then(result => {
        expect(result).toBe('the lazy dog.')
      })
      Common.sandboxEval('slice(4,19)', sentence).then(result => {
        expect(result).toBe('quick brown fox')
      })
      Common.sandboxEval('slice(-4)', sentence).then(result => {
        expect(result).toBe('dog.')
      })
      Common.sandboxEval('slice(-9,-5)', sentence).then(result => {
        expect(result).toBe('lazy')
      })
    })
    test('split', () => {
      Common.sandboxEval('split(" ")[3]', sentence).then(result => {
        expect(result).toBe('fox')
      })
      Common.sandboxEval('split("")[3]', sentence).then(result => {
        expect(result).toBe('k')
      })
    })
    test('substring', () => {
      Common.sandboxEval('substring(1, 3)', 'Dhruv').then(result => {
        expect(result).toBe('hr')
      })
      Common.sandboxEval('substring(2)', 'Dhruv').then(result => {
        expect(result).toBe('ruv')
      })
    })
    test('toLowerCase', () => {
      Common.sandboxEval('toLowerCase()', sentence).then(result => {
        expect(result).toBe('the quick brown fox jumps over the lazy dog.')
      })
    })
    test('toUpperCase', () => {
      Common.sandboxEval('toUpperCase()', sentence).then(result => {
        expect(result).toBe('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.')
      })
    })
    test('trim', () => {
      const greeting = '   Hello world!   '
      Common.sandboxEval('trim()', greeting).then(result => {
        expect(result).toBe('Hello world!')
      })
    })
    test('trimStart', () => {
      const greeting = '   Hello world!   '
      Common.sandboxEval('trimStart()', greeting).then(result => {
        expect(result).toBe('Hello world!   ')
      })
    })
    test('trimEnd', () => {
      const greeting = '   Hello world!   '
      Common.sandboxEval('trimEnd()', greeting).then(result => {
        expect(result).toBe('   Hello world!')
      })
    })
  })
})
