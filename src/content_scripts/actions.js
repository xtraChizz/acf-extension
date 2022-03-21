import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { DataStore, Logger } from '@dhruv-techapps/core-common'
import { BrowserActionService, NotificationsService, SoundService } from '@dhruv-techapps/core-services'
import Action from './action'

const Actions = (() => {
  const start = async (actions, batchRepeat, sheets) => {
    Logger.debug('\t\t\t Actions >> start')
    const settings = DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS)
    for (let i = 0; i < actions.length; i += 1) {
      BrowserActionService.setBadgeBackgroundColor({ color: [25, 135, 84, 1] })
      BrowserActionService.setBadgeText({ text: `${batchRepeat}-${i}` })
      BrowserActionService.setTitle({ title: `Batch:${batchRepeat} Action:${i}` })
      actions[i].status = await Action.start(
        actions[i],
        batchRepeat,
        sheets,
        actions.map(action => action.status)
      )
      if (settings.notifications.onAction) {
        NotificationsService.create({ title: 'Action Completed', message: actions[i].elementFinder })
        if (settings.notifications.sound) SoundService.play()
      }
    }
  }
  return { start }
})()

export default Actions
