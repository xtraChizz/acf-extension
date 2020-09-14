import { Runtime } from '@dhruv-techapps/core-extension'

export const Connect = Runtime.connect({ name })
Connect.onMessage.addListener((message, port) => {})
