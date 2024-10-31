import { NETWORK_STATUS_MESSAGE } from './constants'

/**
 * An interface representing a successful response from an API call.
 */
interface SuccessResponse<T> {
  data: T | any
  message: string
  success: boolean
  count?: number
}

/**
 * Defines the structure of an error response object.
 */
interface ErrorResponse {
  message: string
  success: boolean
  data?: any
}

/**
 * A union type that represents either a successful response or an error response.
 */
type Option<T> = SuccessResponse<T> | ErrorResponse

/**
 * Handles errors that occur during requests and returns an error response object.
 */
function onError(error: any): ErrorResponse {
  const msg = error.message || NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR
  return {
    message: msg,
    success: false,
    data: error
  }
}

/**
 * Returns a success response object with the given data.
 */
function onSuccess<T>(data: T): SuccessResponse<T> {
  return {
    data,
    success: true,
    message: NETWORK_STATUS_MESSAGE.SUCCESS,
    count: Array.isArray(data) ? data.length : 1
  }
}

export { onError, onSuccess, type Option }
