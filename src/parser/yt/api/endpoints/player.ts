import { NavigationSome, UrlEndpoint, WatchEndpoint } from '@parser/yt/utility/navigation'
import { Text } from '../../components/text'
import { Thumbnail } from '../../components/thumbnail'
import { Renderer, Runs, Some } from '../../core'
import { Endpoint, fetchYt, BaseResponse } from '../core'

export const getPlayer = (videoId: string): Promise<PlayerResponse> =>
  fetchYt(Endpoint.Player, { videoId })

export type PlayerResponse = BaseResponse & {
  playabilityStatus: {
    status: 'OK'
    playableInEmbed: boolean
    /** Omitted */
    offlineability: Record<string, any>
    miniPlayer: Renderer<'TODO'>
    contextParams: string
  }
  /** Available formats and links to resources */
  streamingData: {
    /** Time until the links no longer work and must be refreshed. ~6 hours as far as I've seen */
    expiresInSeconds: string
    /** Formats that include both audio and video. Limited to 720p 30fps */
    formats: PlayerFormat[]
    /** Formats that include one of audio or video */
    adaptiveFormats: (AdaptivePlayerAudioFormat | AdaptivePlayerVideoFormat)[]
  }
  videoDetails: VideoDetails
  microformat: MicroFormat

  /** Renderers for the items that show up at the end of the video */
  endscreen: Renderer<'endscreen', { elements: Renderer<'endscreenElement', Record<string, any>> }>

  videoQualityPromoSupportedRenderers: Record<string, any>
  captions: Record<string, any>
  storyboards: Renderer<'playerStoryboardSpec', { spec: string }>
  heartbeatParams: Record<string, any>
  playbackTracking: Record<string, any>
  attestation: Record<string, any>
  annotations: Record<string, any>[]
  playerConfig: Record<string, any>
}

type VideoDetails = {
  videoId: string
  title: string
  lengthSeconds: string
  keywords: string[]
  channelId: string
  isOwnerViewing: boolean
  shortDescription: string
  isCrawlable: boolean
  thumbnail: Thumbnail
  allowRatings: boolean
  viewCount: string
  /** Plaintext string name of author. For example 2kliksphilip */
  author: string
  isPrivate: boolean
  isUnpluggedCorpus: boolean
  isLiveContent: boolean
}

type MicroFormat = Renderer<
  'playerMicroformat',
  {
    title: Runs<Text>
    /** TODO: Check if this is a short or full description */
    description: Some<NavigationSome<UrlEndpoint | WatchEndpoint, Text>>
    lengthSeconds: string
    viewCount: string
    category: string
    isFamilySafe: boolean
    isUnlisted: boolean
    thumbnail: Thumbnail

    /** Date of publish in YYYY-MM-DD format. For example 2022-05-25 */
    publishDate: string
    /** Date of upload in YYYY-MM-DD format. For example 2022-05-25. You likely want the publish date instead */
    uploadDate: string

    /** Browse ID for the channel */
    externalChannelId: string
    /** Plaintext string name of author. For example 2kliksphilip */
    ownerChannelName: string
    /** Link to the owner's user profile, not channel. Although these seem to be the same thing? For example "http://www.youtube.com/user/2kliksphilip". The channel would be "http://www.youtube.com/c/2kliksphilip" */
    ownerProfileUrl: string

    /** List of 2 letter country codes. For example CA, US, FR, etc. */
    availableCountries: string[]
    hasYpcMetadata: boolean
    embed: {
      iframeUrl: string
      flashUrl: string
      width: number
      height: number
      flashSecureUrl: string
    }
  }
>

type PlayerFormat = {
  itag: number
  url: string
  mimeType: string
  bitrate: number
  width: number
  height: number
  lastModified: string
  contentLength: string
  quality: 'medium' | 'hd720'
  fps: number
  qualityLabel: '360p' | '720p'
  projectionType: 'RECTANGULAR' // Can it be anything else
  averageBitrate: number
  audioQuality: 'AUDIO_QUALITY_LOW' | 'AUDIO_QUALITY_MEDIUM' // Can it be 'AUDIO_QUALITY_HIGH'
  approxDurationMs: string
  audioSampleRate: string
  audioChannels: number
}

type AdaptivePlayerVideoFormat = {
  itag: number

  url: string
  mimeType: string
  bitrate: number
  width: number
  height: number
  fps: number
  averageBitrate: number
  approxDurationMs: string

  lastModified: string
  contentLength: string
  quality:
    | 'tiny'
    | 'small'
    | 'medium'
    | 'large'
    | 'hd720'
    | 'hd1080'
    | 'hd1440'
    | 'hd2160'
    | 'highres'
  qualityLabel:
    | '144p'
    | '240p'
    | '360p'
    | '480p'
    | '720p'
    | '720p60'
    | '1080p'
    | '1080p60'
    | '1440p'
    | '1440p60'
    | '2160p'
    | '2160p60'
    | '4320p'
    | '4320p60'

  projectionType: 'RECTANGULAR'
  initRange: {
    start: string
    end: string
  }
  indexRange: {
    start: string
    end: string
  }
  colorInfo: {
    primaries: string // Only seen 'COLOR_PRIMARIES_BT709'
    transferCharacteristics: string // Only seen 'COLOR_TRANSFER_CHARACTERISTICS_BT709'
    matrixCoefficients: string // Only seen 'COLOR_MATRIX_COEFFICIENTS_BT709'
  }
}

type AdaptivePlayerAudioFormat = {
  itag: number

  url: string
  mimeType: string
  bitrate: number
  averageBitrate: number
  approxDurationMs: string
  audioSampleRate: string
  audioChannels: number
  loudnessDb: number

  contentLength: string
  lastModified: string
  quality: 'tiny'
  audioQuality: 'AUDIO_QUALITY_LOW' | 'AUDIO_QUALITY_MEDIUM'
  initRange: {
    start: string
    end: string
  }
  indexRange: {
    start: string
    end: string
  }
  projectionType: 'RECTANGULAR'
}
