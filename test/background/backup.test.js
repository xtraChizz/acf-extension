import { manifest } from '../common'
import Backup from '../../src/background/backup'

beforeAll(() => {
  chrome.runtime.getManifest.mockImplementation(() => manifest)
  chrome.storage.local.get.mockImplementation(async name => ({ [name]: { id: 123 } }))
})

describe.skip('Backup ', () => {
  describe('processPortMessage', () => {
    test('post discord notify', async () => {
      global.fetch = jest.fn(() => {})

      await new Backup().processPortMessage({ notification: { title: 'title', fields: [], color: 'green' } })
      expect(global.fetch).toBeCalled()
    })
  })
})
