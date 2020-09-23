export class CustomError extends Error {
  constructor (message, title) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message)
    this.name = 'CustomError'
    this.title = title
  }
}
