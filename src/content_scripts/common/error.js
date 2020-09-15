import { Connect } from '../chrome/runtime/port'
import { GoogleAnalytics, GoogleAnalyticsType } from '@dhruv-techapps/core-extension'

export const onError = (error) => Connect.postMessage({ action: GoogleAnalytics.name, type: GoogleAnalyticsType.TRACK_EVENT, page: 'content_scripts', error: error.stack })
