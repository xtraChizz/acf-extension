import { defaultConfig } from '@dhruv-techapps/acf-common'
import Config from '../../src/background/config'

const configs = [
  {},
  { url: '' },
  { url: '' },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/url-test/hello/test/?name=Dharmesh&age=33&lang=eng', enable: false },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/url-test/hello/test/?name=Dharmesh&age=33' },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/url-test/hello/test/?name=Dharmesh' },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/url-test/hello/test/?' },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/url-test/hello/test/?name=Dharmesh&age=33&lang=eng#hash' },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/url-test/hello/test/' },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/url-test/hello/' },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/url-test/' },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/\\w+-\\w+/\\w+/test/' },
  { ...defaultConfig, url: 'https://test.getautoclicker.com/' }
]

beforeAll(() => {
  chrome.storage.local.get.mockImplementation(async name => ({ [name]: configs }))
})

let href = 'https://test.getautoclicker.com/url-test/hello/test/?name=Dharmesh&age=33&lang=eng#hash'

describe('Config', () => {
  describe('urlMatcher', () => {
    test.each([...configs.filter(config => config.url).map(config => [config.url])])('%s', url => {
      expect(new Config().urlMatcher(url, href)).toBeTruthy()
    })
  })

  describe('processPortMessage', () => {
    describe('POSITIVE', () => {
      test('complete url', () => {
        new Config().processPortMessage({ href }).then(config => {
          expect(config).toEqual(configs[7])
        })
        href = 'https://test.getautoclicker.com/url-test/hello/test/'
        new Config().processPortMessage({ href }).then(config => {
          expect(config).toEqual(configs[8])
        })
      })
      test('sub url match(disabled)', () => {
        href = 'https://test.getautoclicker.com/url-test/hello/test/?name=Dharmesh&age=33&lang=eng'
        new Config().processPortMessage({ href }).then(config => {
          expect(config).toEqual(configs[4])
        })
      })
      test('regex', () => {
        href = 'https://test.getautoclicker.com/en-us/hello/test/'
        new Config().processPortMessage({ href }).then(config => {
          expect(config).toEqual(configs[11])
        })
      })
    })
    describe('NEGATIVE', () => {
      test('no match', async () => {
        href = 'https://dev.getautoclicker.com/'
        const config = await new Config().processPortMessage({ href })
        expect(config).toBeNull()
      })

      test('no configs', async () => {
        chrome.storage.local.get.mockImplementation(async () => ({}))
        href = 'https://dev.getautoclicker.com/'
        const config = await new Config().processPortMessage({ href })
        expect(config).toBeNull()
      })
    })
  })
})
