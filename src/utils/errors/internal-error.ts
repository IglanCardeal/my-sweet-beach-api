export class InternalError extends Error {
  constructor (
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message)
    this.name = this.constructor.name // InternalError
    this.code = code
    this.description = description

    Error.captureStackTrace(this, this.constructor)
  }
}
