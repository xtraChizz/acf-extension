import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { DataStore, NotificationsService, SoundService } from '@dhruv-techapps/core-common'
import Action from './action'

const Actions = (() => {
  const start = async (actions, batchIndex) => {
    // Logger.debug('\t\t\t Actions >> start')
    const settings = DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS)
    for (let i = 0; i < actions.length; i++) {
      await Action.start(actions[i], i + 1, batchIndex)
      if (settings.notifications.onAction) {
        NotificationsService.create({ title: 'Action Completed', message: actions[i].elementFinder })
        settings.notifications.sound && SoundService.play()
      }
    }
  }
  return { start }
})()

export default Actions
