import CustomError from './custom-error'

export default class SystemError extends CustomError {
  constructor (title, ...params) {
    super(title, ...params)
    this.name = 'SystemError'
  }
}
