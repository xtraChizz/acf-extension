/* eslint-disable no-console */
import { ACTION_CONDITION_OPR, ACTION_RUNNING, ACTION_STATUS } from '@dhruv-techapps/acf-common'
import Statement from './statement'

describe('Statement.conditionResult', () => {
  const { SKIPPED, DONE } = ACTION_STATUS
  const { AND, OR } = ACTION_CONDITION_OPR
  describe('AND ', () => {
    describe('Truthy', () => {
      test.each([
        [SKIPPED, DONE, [SKIPPED, DONE]],
        [DONE, SKIPPED, [DONE, SKIPPED]],
        [SKIPPED, SKIPPED, [SKIPPED, SKIPPED]],
        [DONE, DONE, [DONE, DONE]]
      ])('%s\tAND\t%s\t=\t%s)', (status1, status2, actions) => {
        expect(
          Statement.conditionResult(
            [
              { actionIndex: 0, status: status1 },
              { actionIndex: 1, status: status2, operator: AND }
            ],
            actions
          )
        ).toBeTruthy()
      })
    })
    describe('Falsy', () => {
      test.each([
        [SKIPPED, SKIPPED, [DONE, SKIPPED]],
        [SKIPPED, SKIPPED, [SKIPPED, DONE]],
        [SKIPPED, SKIPPED, [DONE, DONE]],
        [SKIPPED, DONE, [SKIPPED, SKIPPED]],
        [SKIPPED, DONE, [DONE, SKIPPED]],
        [SKIPPED, DONE, [DONE, DONE]],
        [DONE, SKIPPED, [SKIPPED, SKIPPED]],
        [DONE, SKIPPED, [SKIPPED, DONE]],
        [DONE, SKIPPED, [DONE, DONE]],
        [DONE, DONE, [SKIPPED, SKIPPED]],
        [DONE, DONE, [SKIPPED, DONE]],
        [DONE, DONE, [DONE, SKIPPED]]
      ])('%s\tAND\t%s\t=\t%s)', (status1, status2, actions) => {
        expect(
          Statement.conditionResult(
            [
              { actionIndex: 0, status: status1 },
              { actionIndex: 1, status: status2, operator: AND }
            ],
            actions
          )
        ).toBeFalsy()
      })
    })
  })

  describe('OR ', () => {
    describe('Truthy', () => {
      test.each([
        [SKIPPED, SKIPPED, [SKIPPED, SKIPPED]],
        [SKIPPED, SKIPPED, [DONE, SKIPPED]],
        [SKIPPED, SKIPPED, [SKIPPED, DONE]],
        [SKIPPED, DONE, [SKIPPED, DONE]],
        [SKIPPED, DONE, [DONE, DONE]],
        [SKIPPED, DONE, [SKIPPED, SKIPPED]],
        [DONE, SKIPPED, [DONE, SKIPPED]],
        [DONE, SKIPPED, [DONE, DONE]],
        [DONE, SKIPPED, [SKIPPED, SKIPPED]],
        [DONE, DONE, [DONE, DONE]],
        [DONE, DONE, [SKIPPED, DONE]],
        [DONE, DONE, [DONE, SKIPPED]]
      ])('%s\tOR\t%s\t=\t%s)', (status1, status2, actions) => {
        expect(
          Statement.conditionResult(
            [
              { actionIndex: 0, status: status1 },
              { actionIndex: 1, status: status2, operator: OR }
            ],
            actions
          )
        ).toBeTruthy()
      })
    })
    describe('Falsy', () => {
      test.each([
        [SKIPPED, SKIPPED, [DONE, DONE]],
        [DONE, SKIPPED, [SKIPPED, DONE]],
        [SKIPPED, DONE, [DONE, SKIPPED]],
        [DONE, DONE, [SKIPPED, SKIPPED]]
      ])('%s\tOR\t%s\t=\t%s)', (status1, status2, actions) => {
        expect(
          Statement.conditionResult(
            [
              { actionIndex: 0, status: status1 },
              { actionIndex: 1, status: status2, operator: OR }
            ],
            actions
          )
        ).toBeFalsy()
      })
    })
  })
})

describe('Statement.checkThen', () => {
  const { SKIP, PROCEED } = ACTION_RUNNING
  describe('Truthy', () => {
    test.each([
      [true, PROCEED],
      [false, SKIP]
    ])('%s -> %s = PROCEED', (condition, running) => {
      expect(Statement.checkThen(condition, running)).toBeTruthy()
    })
  })
  describe('Falsy', () => {
    test.each([
      [true, SKIP],
      [false, PROCEED]
    ])('%s -> %s = SKIP', (condition, running) => {
      expect(Statement.checkThen(condition, running)).toBeFalsy()
    })
  })
})
