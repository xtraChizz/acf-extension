import { Logger } from '@dhruv-techapps/core-common'

export * from './config-error'
export * from './custom-error'
export * from './system-error'
export const onError = error => Logger.colorError(error)
