import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { DataStore, Logger, NotificationsService, SoundService } from '@dhruv-techapps/core-common'
import Actions from './actions'
import { wait } from './util'

const Batch = (() => {
  let batch
  let actions
  let sheets

  const refresh = () => {
    Logger.debug('\t\t Batch >> refresh')
    if (document.readyState === 'complete') {
      window.location.reload()
    } else {
      window.addEventListener('load', () => {
        window.location.reload()
      })
    }
  }

  const checkRepeat = async () => {
    Logger.debug('\t\t Batch >> checkRepeat')
    const settings = DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS)
    if (batch.repeat > 0) {
      for (let i = 0; i < batch.repeat; i += 1) {
        if (batch.repeatInterval) {
          await wait(batch.repeatInterval, 'Batch Repeat')
        }
        await Actions.start(actions, i + 1, sheets)
        if (settings.notifications.onBatch) {
          NotificationsService.create({ title: 'Batch Completed', message: `#${i + 1} Batch` }, 'batch-completed')
          if (settings.notifications.sound) SoundService.play()
        }
      }
    } else if (batch.repeat < -1) {
      let i = 1
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (batch.repeatInterval) {
          await wait(batch.repeatInterval, 'Batch Repeat')
        }
        await Actions.start(actions, i, sheets)
        i += 1
      }
    }
  }

  const start = async (_batch, _actions, _sheets) => {
    Logger.debug('\t\t Batch >> start')
    batch = _batch
    actions = _actions
    sheets = _sheets
    await Actions.start(_actions, 0, sheets)
    if (batch.refresh) {
      refresh()
    } else {
      await checkRepeat()
    }
  }

  return { start }
})()

export default Batch
