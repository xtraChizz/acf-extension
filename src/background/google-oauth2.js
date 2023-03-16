import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'

export default class GoogleOauth2 {
  static async removeCachedAuthToken() {
    const { token } = await chrome.identity.getAuthToken({ interactive: false })
    await chrome.identity.removeCachedAuthToken({ token })
    return true
  }

  static async getAuthToken() {
    const { [LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: scopes } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.GOOGLE_SCOPES)
    if (!scopes) {
      throw new Error('Scopes not defined')
    }
    const { token } = await chrome.identity.getAuthToken({ interactive: true, scopes })
    return token
  }

  static async getHeaders() {
    const token = await GoogleOauth2.getAuthToken()
    return new Headers({ Authorization: `Bearer ${token}` })
  }

  static async addScope(scope) {
    const { [LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: scopes = [] } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.GOOGLE_SCOPES)
    if (!scopes.includes(scope)) {
      scopes.push(scope)
      await chrome.storage.local.set({ [LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: scopes })
    }
  }
}
