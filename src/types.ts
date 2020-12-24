import { Dispatch, SetStateAction } from 'react'

export type ApiContextInterface = {
  baseUrl?: string;
  errorFallback?: (response: { status?: number, body?: any, headers?: Headers }) => Promise<boolean>;
  onResponse?: (response: Response) => Promise<any>;
  headers?: Headers;
  httpHandler?: HttpHandler;
}

export const GET = 'GET'
export const POST = 'POST'
export const PUT = 'PUT'
export const DELETE = 'DELETE'
export const HEAD = 'HEAD'
export const OPTIONS = 'OPTIONS'

export const INITIALIZED = 'initialized'
export const PENDING = 'pending'
export const ERROR = 'error'
export const SUCCESS = 'success'

export type HttpMethod = typeof GET | typeof POST | typeof PUT | typeof DELETE | typeof HEAD | typeof OPTIONS;
export type NetworkStatus = typeof INITIALIZED | typeof PENDING | typeof ERROR | typeof SUCCESS;
export type ApiErrorType = string | object | undefined | null;
export type QueryParams = { [key: string]: any };
export type CallOptions = { params?: QueryParams, requestBody?: string | Blob | FormData; requestHeaders?: Headers };
export type HttpRequest = {
  method: HttpMethod,
  url: string,
  provider: ApiContextInterface,
  params?: QueryParams,
  requestBody?: string | Blob | FormData,
  headers?: Headers
};
export type ResponseHandler<B, E> = {
  bodyHandler: [B | undefined, Dispatch<SetStateAction<B | undefined>>],
  networkStateHandler: [NetworkStatus, Dispatch<SetStateAction<NetworkStatus>>],
  errorHandler: [E | undefined, Dispatch<SetStateAction<E | undefined>>],
  loadingHandler: [boolean, Dispatch<SetStateAction<boolean>>],
  statusCodeHandler: [number, Dispatch<SetStateAction<number>>],
  headersHandler: [Headers | undefined, Dispatch<SetStateAction<Headers | undefined>>],
  fallbackHandler: [boolean, Dispatch<SetStateAction<boolean>>],
};
export type HttpHandler = <B, E>(request: HttpRequest, handlers: ResponseHandler<B, E>) => void;
