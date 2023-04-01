import { LOCAL_STORAGE_KEY, RESPONSE_CODE } from '@dhruv-techapps/acf-common'
import { CHROME } from '@dhruv-techapps/core-common'
import { manifest } from '../common'
import DiscordOauth2, { NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from '../../src/background/discord-oauth2'
import { NotificationHandler } from '../../src/background/notifications'

beforeAll(() => {
  chrome.runtime.getManifest.mockImplementation(() => manifest)
})

describe('DiscordOauth2 ', () => {
  let discord

  beforeEach(() => {
    discord = new DiscordOauth2()
  })

  describe('remove', () => {
    test('remove or logout from discord', async () => {
      const result = await discord.remove()
      expect(chrome.storage.local.remove).toBeCalled()
      expect(chrome.storage.local.remove).toBeCalledWith(LOCAL_STORAGE_KEY.DISCORD)
      expect(result).toEqual(RESPONSE_CODE.REMOVED)
    })
  })

  describe('notify', () => {
    test('check notify function is getting called', () => {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'MESSAGE', true).then(() => {
        expect(chrome.notifications.create).toBeCalled()
        expect(chrome.notifications.create).toBeCalledWith('discord', {
          type: CHROME.NOTIFICATIONS_OPTIONS.TYPE.BASIC,
          title: NOTIFICATIONS_TITLE,
          message: 'MESSAGE',
          iconUrl: manifest.action.default_icon,
          requireInteraction: true,
          silent: false
        })
      })
    })
  })

  describe('processPortMessage', () => {
    test('login:true', async () => {
      const loginSpy = jest.spyOn(discord, 'login')
      await discord.processPortMessage({ login: true })
      expect(loginSpy).toBeCalled()
    })
    test('remove:true', async () => {
      const removeSpy = jest.spyOn(discord, 'remove')
      const result = await discord.processPortMessage({ remove: true })
      expect(removeSpy).toBeCalled()
      expect(result).toEqual(RESPONSE_CODE.REMOVED)
    })
  })

  describe('getCurrentUser', () => {
    test('login:true', async () => {
      // Mock fetch to return a dummy response with user data
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ id: '1234' })
        })
      )
      const result = await discord.getCurrentUser('token')
      expect(result).toEqual({ id: '1234' })
    })
  })

  describe('login', () => {
    test('login with correct response', async () => {
      // Mock chrome.identity.getRedirectURL to return a dummy URL
      chrome.identity.getRedirectURL = jest.fn(() => 'https://getautoclicker.com/')

      // Mock chrome.identity.launchWebAuthFlow to return a dummy response URL
      chrome.identity.launchWebAuthFlow = jest.fn(() => 'https://getautoclicker.com/?token=1234&scope=identity')

      // Mock fetch to return a dummy response with user data
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ id: '1234' })
        })
      )

      const getCurrentUserSpy = jest.spyOn(discord, 'getCurrentUser')

      // Call the login method and wait for it to complete
      const result = await discord.login()
      // Verify that the method returns the expected response
      expect(result).toEqual({ id: '1234' })
      expect(chrome.identity.getRedirectURL).toBeCalled()
      expect(chrome.identity.launchWebAuthFlow).toBeCalled()
      expect(getCurrentUserSpy).toBeCalled()
      expect(chrome.storage.local.set).toBeCalled()
    })

    test('error scenario', async () => {
      // Mock chrome.identity.getRedirectURL to return a dummy URL
      chrome.identity.getRedirectURL = jest.fn(() => 'https://getautoclicker.com/')

      // Mock chrome.identity.launchWebAuthFlow to return a dummy response URL
      chrome.identity.launchWebAuthFlow = jest.fn(() => 'https://getautoclicker.com/?access_denied=true')

      const getCurrentUserSpy = jest.spyOn(discord, 'getCurrentUser')

      // Call the login method and wait for it to complete
      const result = await discord.login()
      // Verify that the method returns the expected response
      expect(result).toEqual(RESPONSE_CODE.ERROR)
      expect(chrome.identity.getRedirectURL).toBeCalled()
      expect(chrome.identity.launchWebAuthFlow).toBeCalled()
      expect(getCurrentUserSpy).not.toBeCalled()
      expect(chrome.notifications.create).toBeCalled()
      expect(chrome.notifications.create).toBeCalledWith(NOTIFICATIONS_ID, {
        type: CHROME.NOTIFICATIONS_OPTIONS.TYPE.BASIC,
        title: NOTIFICATIONS_TITLE,
        message: 'https://getautoclicker.com/?access_denied=true',
        iconUrl: manifest.action.default_icon,
        requireInteraction: true,
        silent: false
      })
    })
  })
})
