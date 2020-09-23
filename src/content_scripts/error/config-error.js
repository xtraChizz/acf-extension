import { CustomError } from './custom-error'

export class ConfigError extends CustomError {
  constructor (message, title) {
    super(message, title)
    this.name = 'ConfigError'
  }
}
