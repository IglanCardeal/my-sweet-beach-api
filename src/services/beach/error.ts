export class ParamError extends Error {
  constructor (message: string) {
    super()
    this.message = message
  }
}
