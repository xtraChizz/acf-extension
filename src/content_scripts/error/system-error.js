import { CustomError } from './custom-error'

export class SystemError extends CustomError {
  constructor (message, title) {
    super(message, title)
    this.name = 'SystemError'
  }
}
