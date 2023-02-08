import { ACTION_STATUS, defaultAction } from '@dhruv-techapps/acf-common'
import Action from '../../src/content_scripts/action'
import Statement from '../../src/content_scripts/statement'

jest.mock('../../src/content_scripts/statement')

describe('Action.start', () => {
  test('default', () => {
    Action.start(defaultAction, 0, [], [defaultAction], 0).then(result => {
      expect(Statement.check).toBeCalledWith([defaultAction], defaultAction.statement)
      expect(result).toEqual(ACTION_STATUS.SKIPPED)
    })
  })
  test('without repeat', () => {
    const action = { ...defaultAction, elementFinder: '//html' }
    Action.start(action, 0, [], [action], 0).then(() => {
      expect(Statement.check).toBeCalledWith([action], action.statement)
      expect(Statement.check).toBeCalledWith([action], action.statement)
    })
  })
})
