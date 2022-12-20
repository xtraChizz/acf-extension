import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { DataStore } from '@dhruv-techapps/core-common'
import { ActionService, NotificationsService } from '@dhruv-techapps/core-services'
import Action from './action'

const Actions = (() => {
  const start = async (actions, batchRepeat, sheets) => {
    const settings = DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS)
    for (let i = 0; i < actions.length; i += 1) {
      ActionService.setBadgeBackgroundColor(chrome.runtime.id, { color: [25, 135, 84, 1] })
      ActionService.setBadgeText(chrome.runtime.id, { text: `${batchRepeat}-${i}` })
      ActionService.setTitle(chrome.runtime.id, { title: `Batch:${batchRepeat} Action:${i}` })
      actions[i].status = await Action.start(
        actions[i],
        batchRepeat,
        sheets,
        actions.map(action => action.status),
        i
      )
      if (settings.notifications.onAction) {
        NotificationsService.create(chrome.runtime.id, { title: 'Action Completed', message: actions[i].elementFinder, silent: !settings.notifications.sound })
      }
    }
  }
  return { start }
})()

export default Actions
