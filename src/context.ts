import React from 'react'
import { ApiContextInterface } from './types'

export const defaultApiResponse = (response: Response) => {
  const checkApiError = (resolve: Function, reject: Function, response: Response, body?: any) => {
    if (response.status >= 200 && response.status < 300) {
      resolve(body ?? {})
      return
    }
    reject(body ?? {})
  }
  return new Promise<any>((resolve, reject) => {
    response.json().then(body => {
      checkApiError(resolve, reject, response, body)
    }).catch(() => {
      checkApiError(resolve, reject, response, {
        status: response.status,
        headers: response.headers,
        body: response.body ?? {}
      })
    })
  })
}

const DefaultApiContext: ApiContextInterface = {}

export const ApiContext = React.createContext(DefaultApiContext)

export const ApiProvider = ApiContext.Provider
