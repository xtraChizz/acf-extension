import { manifest } from '../common'
import GoogleBackup from '../../src/background/google-backup'

beforeAll(() => {
  chrome.runtime.getManifest.mockImplementation(() => manifest)
  chrome.storage.local.get.mockImplementation(async name => ({ [name]: { id: 123 } }))
})

describe.skip('GoogleBackup ', () => {
  describe('processPortMessage', () => {
    test('post discord notify', async () => {
      global.fetch = jest.fn(() => {})

      await new GoogleBackup().processPortMessage({ notification: { title: 'title', fields: [], color: 'green' } })
      expect(global.fetch).toBeCalled()
    })
  })
})
