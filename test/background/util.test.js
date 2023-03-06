import { getRandomValues } from '../../src/background/util'

describe('Util ', () => {
  describe('getRandomValues', () => {
    test('check random values', () => {
      const random = getRandomValues()
      expect(random).toBeDefined()
    })
  })
})
