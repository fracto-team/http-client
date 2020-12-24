import { ERROR, HttpHandler, PENDING, SUCCESS } from '../types'
import { objectToQueryString } from '../utils'

export const fetchHandler: HttpHandler = (request, handlers) => {
  const { url, params, requestBody, method, provider } = request
  const requestHeaders = request.headers
  const [, setLoading] = handlers.loadingHandler
  const [, setNetworkState] = handlers.networkStateHandler
  const [, setStatusCode] = handlers.statusCodeHandler
  const [, setHeaders] = handlers.headersHandler
  const [, setBody] = handlers.bodyHandler
  const [, setError] = handlers.errorHandler
  const [fallback, setFallback] = handlers.fallbackHandler

  setLoading(true)
  setNetworkState(PENDING)
  let link = provider.baseUrl ? provider.baseUrl + url : url
  if (params) {
    const paramsStr = objectToQueryString(params)
    link = `${link}?${paramsStr}`
  }
  const mergedHeaders = provider.headers ? provider.headers : new Headers()
  if (requestHeaders) {
    requestHeaders.forEach((val: string, key: string) => {
      mergedHeaders.set(key, val)
    })
  }

  const responseHandler = (response: Response) => {
    setStatusCode(response.status)
    setHeaders(response.headers)
    if (provider.onResponse) {
      return provider.onResponse(response)
    }
    return new Promise<any>((_, reject) => {
      reject('no response handler')
    })
  }

  const bodyHandler = (response: any) => {
    setBody(response)
    setLoading(false)
    setNetworkState(SUCCESS)
  }

  const errorHandler = (err: any) => {
    const outputError = () => {
      setBody(undefined)
      setLoading(false)
      setError(err)
      setNetworkState(ERROR)
    }

    if (provider.errorFallback && !fallback) {
      setFallback(true)
      provider.errorFallback(err).then((fallbackResponse) => {
        if (fallbackResponse) {
          fetchHandler(request, handlers)
          return
        }

        outputError()
      })
      return
    }
    outputError()
  }


  fetch(link, {
    method: method,
    body: requestBody,
    headers: mergedHeaders
  })
    .then(responseHandler)
    .then(bodyHandler)
    .catch(errorHandler)
    .finally(() => setLoading(false))
}
