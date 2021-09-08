export class MissingTokenError extends Error {
  constructor(message: string) {
    super()
    this.message = message
  }
}
