export const fetchYt = (endpoint: Endpoint, body: Record<string, any>) =>
  fetch(`https://www.youtube.com/youtubei/v1/${endpoint}`, {
    headers: {
      authorization: 'SAPISIDHASH 1653504097_d4bb35c5d98c6543282a50bff46be14555c8fe10',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      context: getContext(),
      ...body,
    }),
    method: 'POST',
    credentials: 'include',
  }).then((res) => {
    if (!res.ok)
      return res.text().then((text) => {
        throw Error(`YT ${endpoint} request failed with status code ${res.status}\n${text}`)
      })
    return res.json()
  })

export const getEndpointContinuation = (endpoint: Endpoint) => (continuation: string) =>
  fetchYt(endpoint, { continuation })

const getContext = () =>
  Object.freeze({
    client: {
      clientName: 'WEB',
      clientVersion: '2.20210506.07.00',
    },
  })

export enum Endpoint {
  /**
   * Used for recommended, get channel, history, etc. The parameters come from browseEndpoint in the YT responses .
   * Recommended - ~1-2s
   * Channel Tabs - ~250ms
   */
  Browse = 'browse',
  /** Used for searching obviously */
  Search = 'search',
  /** Used to populate the sidebar and notably contains all of the subscribed channels. ~200ms*/
  Guide = 'guide',
  /** TODO: */
  Next = 'next',
  /** Used for getting the information needed to play a video. ~200ms */
  Player = 'player',
}

type ServiceTrackingParams = {
  service: string
  params: { key: string; value: string }[]
}

export type ResponseContext = {
  serviceTrackingParams: ServiceTrackingParams[]
  maxAgeSeconds: number
  mainAppWebResponseContext: {
    datasyncId: string
    loggedOut: boolean
  }
  webResponseContextExtensionData: {
    hasDecorated: boolean
    // TODO: Has some other stuff too depending on context. Should probably just Record<string, any> on all of this tbh
  }
}

export type BaseResponse = {
  responseContext: ResponseContext
  frameworkUpdates: Record<string, any>
  topbar?: Record<string, any>
}
