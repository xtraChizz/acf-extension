/* eslint-disable no-console */
import { manifest } from '../common'
import DiscordMessaging from '../../src/background/discord-messaging'

beforeAll(() => {
  chrome.runtime.getManifest.mockImplementation(() => manifest)
  chrome.storage.local.get.mockImplementation(async name => ({ [name]: { id: 123 } }))
})

describe('DiscordMessaging ', () => {
  describe('processPortMessage', () => {
    test('post discord notify', async () => {
      global.fetch = jest.fn(() => {})

      await new DiscordMessaging().processPortMessage({ notification: { title: 'title', fields: [], color: 'green' } })
      expect(global.fetch).toBeCalled()
      /* expect(global.fetch).toHaveBeenCalledWith('FUNCTION_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variant: VARIANT,
          title: 'title',
          id: 123,
          fields: [],
          color: 'green'
        })
      }) */
    })
  })
})
