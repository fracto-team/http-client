import { QueryParams } from './types'

export const objectToQueryString = (initial: QueryParams) => {
  const reducer = (obj: QueryParams, parentPrefix: any = null) => (prev: string[], key: string) => {
    const val = obj[key]
    key = encodeURIComponent(key)
    const prefix = parentPrefix ? `${parentPrefix}[${key}]` : key
    if (val === null || typeof val === 'function') {
      prev.push(`${prefix}=`)
      return prev
    }

    if (['number', 'boolean', 'string'].includes(typeof val)) {
      prev.push(`${prefix}=${encodeURIComponent(val)}`)
      return prev
    }

    prev.push(Object.keys(val).reduce(reducer(val, prefix), []).join('&'))
    return prev
  }

  return Object.keys(initial).reduce(reducer(initial), []).join('&')
}
