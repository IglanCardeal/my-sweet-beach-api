import hsc from 'http-status-codes'

export interface APIError {
  code: number
  message: string
  description?: string
  codeAsString?: string
  documentation?: string
}

export interface APIErrorResponse extends Omit<APIError, 'codeAsStrings'> {
  error: string
}

export class ApiError {
  public static format(error: APIError): APIErrorResponse {
    const base = {
      message: error.message,
      code: error.code,
      error: error.codeAsString
        ? error.codeAsString
        : hsc.getStatusText(error.code)
    }
    const mergedBase = {
      ...base,
      ...(error.documentation && { documentation: error.documentation }),
      ...(error.description && { description: error.description })
    }

    return mergedBase
  }
}
