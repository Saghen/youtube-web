import { FullVideo, Video } from '@parser/types/types'
import { parseFullVideoData } from '@parser/videos/full'
import { parseVideoData } from '@parser/videos/normal'
import { createCache } from './cache'

function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64)
  var len = binaryString.length
  var bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

type Message = {
  command: string
  [key: string]: any
}

type MessageResponse = {
  type?: string
  data?: Record<any, any>
}

export async function sendMessage(message: Message): Promise<any> {
  if (typeof message.command !== 'string') {
    throw new Error('Command to the proxy must be a string')
  }

  return new Promise((resolve, reject) => {
    setTimeout(
      () => reject(`Command timeout on ${message.command}\n${JSON.stringify(message)}`),
      15000
    )
    const { port1, port2 } = new MessageChannel()
    port1.addEventListener(
      'message',
      ({ data, ...all }) => {
        console.log(all)
        if (data.type === 'success') resolve(data.data)
        else reject(data.data)
        port1.close()
        port2.close()
      },
      { once: true }
    )
    port1.start()

    window.parent.postMessage(message, '*', [port2])

    /*
    browser.runtime
      .sendMessage(
        'dffhhhaheneddbnifbbdicadencillcf',
        message,
        ({ type = 'error', data = new Error('Unable to reach proxy') }: MessageResponse = {}) =>
        !type || type === 'error' ? reject(data) : resolve(data)
      )
      .then(resolve)
      .catch(reject)
    */
  })
}

type FetchOptions = {
  body?: Record<any, any>
} & Omit<RequestInit, 'body'>

export async function fetch(url: string, { signal, ...options }: FetchOptions = {}) {
  const hash = Math.round(Math.random() * Number.MAX_SAFE_INTEGER)
    .toString(16)
    .slice(0, 5)

  // @ts-ignore
  if (options.body) options.body = JSON.stringify(options.body)

  return new Promise<Response>((resolve, reject) => {
    signal?.addEventListener('abort', () => {
      sendMessage({
        command: 'fetchAbort',
        hash,
      })
      reject('Fetch was aborted')
    })
    sendMessage({ command: 'fetch', url, options, hash })
      .then(({ data, ...init }) => resolve(new Response(base64ToArrayBuffer(data), init)))
      .catch(reject)
  })
}

export async function fetchInitialData(url = '/', options?: FetchOptions) {
  return sendMessage({
    command: url === '/' ? 'getHomePage' : 'getInitialData',
    url,
    options,
  }).then(({ json }) => JSON.parse(json))
}

export async function fetchHomePage() {
  return sendMessage({ command: 'getHomePage' }).then(({ json }) => JSON.parse(json))
}

export async function fetchSAPISID() {
  return sendMessage({ command: 'getSAPISIDHash' }).then((data) => data.SAPISID)
}

export async function fetchAPIKey() {
  return sendMessage({ command: 'getAPIKey' }).then((data) => data.APIKEY)
}

export async function fetchFromYoutubeAPI(url: string, options: FetchOptions = {}) {
  const [SAPISID, APIKEY] = await Promise.all([fetchSAPISID(), fetchAPIKey()])
  return fetch(`https://www.youtube.com/youtubei/v1${url}?key=${APIKEY}`, {
    ...options,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: SAPISID,
      origin: 'https://www.youtube.com',
      referer: 'https://www.youtube.com',
      ...(options.headers ?? {}),
    },
    body: {
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20210506.07.00',
        },
      },
      ...(options.body ?? {}),
    },
  }).then((res) => res.json())
}

type HomePageResult = {
  videos: Video[]
  getNextPage: () => Promise<HomePageResult>
}

const parseHomePageContents = (ytData: any) => {
  const contents =
    ytData.contents?.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer
      .contents ??
    ytData.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems
  const videos = contents
    .map((video: any) => video?.richItemRenderer?.content?.videoRenderer)
    .filter(Boolean)
    .filter((video: any) => !video.upcomingEventData)
    .map((video: any) => {
      try {
        return parseVideoData(video)
      } catch (err) {
        console.error(err)
        return
      }
    })
    .filter(Boolean)

  return {
    videos,
    continuationId: contents.find((video: any) => video.continuationItemRenderer)
      .continuationItemRenderer.continuationEndpoint.continuationCommand.token,
  }
}

function makeGetNextPage(continuationId: string) {
  return () =>
    fetchFromYoutubeAPI('/browse', { body: { continuation: continuationId } })
      .then(parseHomePageContents)
      .then(({ videos, continuationId }) => ({
        videos,
        getNextPage: makeGetNextPage(continuationId),
      }))
}

export async function getHomePage(): Promise<HomePageResult> {
  const { videos, continuationId } = await fetchHomePage().then(parseHomePageContents)

  return {
    videos,
    getNextPage: makeGetNextPage(continuationId),
  }
}

const searchCache = createCache<Video[] | Promise<Video[]>>({ timeout: 1000 * 60 * 5 })
export async function getSearch(query: string, opts?: FetchOptions): Promise<Video[]> {
  query = query.replace(/\+/, ' ')
  const cachedValue = searchCache.get(query)
  if (cachedValue) return cachedValue

  const req = fetchInitialData('/results?search_query=' + query, opts)
    .then((ytData: any) =>
      ytData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents
        .map((video: any) => video.videoRenderer)
        .filter(Boolean)
        .filter((video: any) => !video.upcomingEventData)
        .map((video: any) => {
          try {
            return parseVideoData(video)
          } catch (err) {
            // console.error(err)
            return
          }
        })
        .filter(Boolean)
    )
    .then((videos) => {
      searchCache.set(query, videos)
      return videos
    })

  searchCache.set(query, req)

  return req
}

export async function getVideo(id: string, opts?: FetchOptions): Promise<FullVideo> {
  return fetchInitialData('/watch?v=' + id, opts).then((ytData: any) =>
    parseFullVideoData(id, ytData.contents.twoColumnWatchNextResults.results.results.contents)
  )
}
