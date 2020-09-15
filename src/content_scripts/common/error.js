import { GoogleAnalytics, GoogleAnalyticsType } from '@dhruv-techapps/core-extension'

export const onError = (error) => chrome.runtime.sendMessage({ action: GoogleAnalytics.name, type: GoogleAnalyticsType.TRACK_EVENT, page: 'content_scripts', error: error.stack })
