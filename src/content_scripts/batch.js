import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { DataStore, NotificationsService, SoundService } from '@dhruv-techapps/core-common'
import Actions from './actions'
import { wait } from './util'

const Batch = (() => {
  let batch, actions
  const start = async (_batch, _actions) => {
    // Logger.debug('\t\t Batch >> start')
    batch = _batch
    actions = _actions
    await Actions.start(_actions, 0)
    if (batch.refresh) {
      _refresh()
    } else {
      await _checkRepeat()
    }
  }

  const _refresh = () => {
    // Logger.debug('\t\t Batch >> _refresh')
    if (document.readyState === 'complete') {
      location.reload()
    } else {
      window.addEventListener('load', function () {
        location.reload()
      })
    }
  }

  const _checkRepeat = async () => {
    // Logger.debug('\t\t Batch >> _checkRepeat')
    const settings = DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS)
    if (batch.repeat) {
      for (let i = 0; i < batch.repeat; i++) {
        if (batch.repeatInterval) {
          await wait(batch.repeatInterval, 'Batch Repeat')
        }
        await Actions.start(actions, i + 1)
        if (settings.notifications.onBatch) {
          NotificationsService.create({ title: 'Batch Completed', message: `#${i + 1} Batch` })
          settings.notifications.sound && SoundService.play()
        }
      }
    }
  }

  return { start }
})()

export default Batch
