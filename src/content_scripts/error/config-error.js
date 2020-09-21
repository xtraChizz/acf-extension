import { CustomError } from './custom-error'

export class ConfigError extends CustomError {
  constructor (title, ...params) {
    super(title, ...params)
    this.name = 'ConfigError'
  }
}
