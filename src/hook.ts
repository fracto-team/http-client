import { useCallback, useContext, useState } from 'react'
import { ApiContext } from './context'
import {
  ApiErrorType,
  CallOptions,
  HttpMethod,
  HttpRequest,
  INITIALIZED,
  NetworkStatus,
  ResponseHandler
} from './types'
import { fetchHandler } from './handlers/fetch.handler'

export const useAPI = <ResponseType, ErrorType extends ApiErrorType>(method: HttpMethod, url: string) => {
  const provider = useContext(ApiContext)
  const [body, setBody] = useState<ResponseType | undefined>(undefined)
  const [networkState, setNetworkState] = useState<NetworkStatus>(INITIALIZED)
  const [error, setError] = useState<ErrorType>()
  const [loading, setLoading] = useState<boolean>(false)
  const [fallback, setFallback] = useState<boolean>(false)
  const [statusCode, setStatusCode] = useState<number>(-1)
  const [headers, setHeaders] = useState<Headers>()

  const call = useCallback((options?: CallOptions) => {
    const request: HttpRequest = {
      url: url,
      method: method,
      requestBody: options?.requestBody,
      params: options?.params,
      provider: provider,
      headers: options?.requestHeaders
    }

    const handler: ResponseHandler<ResponseType, ErrorType> = {
      bodyHandler: [body, setBody],
      errorHandler: [error, setError],
      headersHandler: [headers, setHeaders],
      loadingHandler: [loading, setLoading],
      networkStateHandler: [networkState, setNetworkState],
      statusCodeHandler: [statusCode, setStatusCode],
      fallbackHandler: [fallback, setFallback]
    }

    if (provider.httpHandler) {
      provider.httpHandler<ResponseType, ErrorType>(request, handler)
      return
    }
    fetchHandler<ResponseType, ErrorType>(request, handler)
  }, [fallback, url, method])

  return { call, networkState, loading, body, error, statusCode, headers }
}
