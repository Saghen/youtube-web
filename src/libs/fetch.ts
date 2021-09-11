import { createCache } from './cache'
import { FullVideo, parseFullVideoData, parseVideoData, Video } from './yt-parser'

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
    chrome.runtime.sendMessage<Message, MessageResponse>(
      'dffhhhaheneddbnifbbdicadencillcf',
      message,
      ({ type = 'error', data = new Error('Unable to reach proxy') } = {}) =>
        !type || type === 'error' ? reject(data) : resolve(data)
    )
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
      chrome.runtime.sendMessage('dffhhhaheneddbnifbbdicadencillcf', {
        command: 'fetchAbort',
        hash,
      })
      reject('Fetch was aborted')
    })
    sendMessage({ command: 'fetch', url, options, hash })
      .then((data) => resolve(new Response(data)))
      .catch(reject)
  })
}

export async function fetchHomePage() {
  return sendMessage({ command: 'getHomePage' }).then(data => JSON.parse(data.json))
}

export async function fetchSAPISID() {
  return sendMessage({ command: 'getSAPISIDHash' }).then((data) => data.SAPISID)
}

export async function fetchAPIKey() {
  return sendMessage({ command: 'getSAPISIDHash' }).then((data) => data.APIKEY)
}

export async function fetchFromYouTube(url: string, options?: FetchOptions) {
  return fetch('https://youtube.com' + url, options)
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
  })
    .then((res) => res.json())
    .then(JSON.parse)
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

function makeGetNextPage(continuationId) {
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

  const req = fetchFromYouTube('/results?search_query=' + query, opts)
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
  return fetchFromYouTube('/watch?v=' + id, opts).then((ytData: any) =>
    parseFullVideoData(id, ytData.contents.twoColumnWatchNextResults.results.results.contents)
  )
}
