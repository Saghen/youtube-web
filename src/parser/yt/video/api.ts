import { BaseResponse, BrowseId, Endpoint, fetchYt } from '../core/api'
import { Button } from '../components/button'
import { ContinuationItem } from '../components/continuation'
import { ItemSection } from '../components/core'
import { RichGrid } from '../components/grid'
import { RichItem } from '../components/item'
import { TabWithIdentifier } from '../components/tab'
import { Text } from '../components/text'
import { Thumbnail } from '../components/thumbnail'
import { TwoColumnBrowseResults, TwoColumnWatchNext } from '../components/two-column'
import { CurrentVideoEndpoint } from '../components/utility/endpoints'
import {
  BrowseEndpoint,
  Navigation,
  NavigationSome,
  UrlEndpoint,
  WatchEndpoint,
} from '../components/utility/navigation'
import { Action, Command, Renderer, Some } from '../core/internals'
import { CompactVideo } from './processors/compact'
import { VideoPrimaryInfo, VideoSecondaryInfo } from './processors/full'
import { BaseVideo, Video } from './processors/regular'

export const getRecommended = (continuationToken?: string): Promise<RecommendedResponse> =>
  fetchYt(
    Endpoint.Browse,
    continuationToken ? { continuation: continuationToken } : { browseId: BrowseId.Recommended }
  )

export const getPlayer = (videoId: string): Promise<PlayerResponse> =>
  fetchYt(Endpoint.Player, { videoId })

export const getVideo = (videoId: string): Promise<VideoResponse> =>
  fetchYt(Endpoint.Next, { videoId })

export const getCompactVideoContinuation = (
  continuationToken: string
): Promise<CompactContinuationResponse> =>
  fetchYt(Endpoint.Next, { continuation: continuationToken })

// Types

// Recommended
type RecommendedResponse = BaseResponse & {
  contents: TwoColumnBrowseResults<
    TabWithIdentifier<
      BrowseId.Recommended,
      RichGrid<RichItem<Video> | ContinuationItem, Renderer<'TODO'>>
    >
  >
  header: Renderer<'feedTabbedHeader', { title: Some<Text> }>
}

// Video
type VideoResponse = BaseResponse & {
  contents: TwoColumnWatchNext<
    | VideoPrimaryInfo
    | VideoSecondaryInfo
    | ItemSection<Renderer<'commentsEntryPointHeader', { TODO: true }>, 'comments-entry-point'>
    | ItemSection<ContinuationItem, 'comment-item-section'>,
    CompactVideo | ContinuationItem
  >
  currentVideoEndpoint: CurrentVideoEndpoint
  playerOverlays: Renderer<
    'playerOverlay',
    {
      endScreen: WatchNextEndScreen<EndScreenVideo | EndScreenPlaylist>
      autoplay: PlayerOverlayAutoplay
      shareButton: Button<Command<'TODO'>>
      addToMenu: Button<Command<'TODO'>>
      videoDetails: Renderer<'TODO'>
    }
  >

  overlay: Renderer<'tooltip', { TODO: true }>
  engagementPanels: Renderer<'engagementPanelSectionList', { TODO: true }>
}

type WatchNextEndScreen<Item extends Renderer> = Renderer<'watchNextEndScreen', { results: Item[] }>

type EndScreenVideo = Renderer<
  'endScreenVideo',
  Pick<
    BaseVideo,
    | 'videoId'
    | 'thumbnail'
    | 'title'
    | 'shortBylineText'
    | 'lengthText'
    | 'shortViewCountText'
    | 'publishedTimeText'
    | 'thumbnailOverlays'
  > &
    Navigation<WatchEndpoint> & { lengthInSeconds: number }
>

type EndScreenPlaylist = Renderer<
  'endScreenPlaylist',
  Navigation<WatchEndpoint> & {
    playlistId: string
    title: Some<Text>
    thumbnail: Thumbnail
    longBylineText: Some<Text>
    videoCountText: Some<Text>
    lengthInSeconds: number
  }
>

type PlayerOverlayAutoplay = Renderer<
  'playerOverlayAutoplay',
  {
    byline: Some<NavigationSome<WatchEndpoint | BrowseEndpoint | UrlEndpoint, Text>>
    pauseText: Some<Text>
    background: Thumbnail
    countDownSecs: number
    countDownSecsForFullscreen: number

    cancelButton: Button<Command<'TODO'>>
    nextButton: Button<Command<'TODO'>>
    closeButton: Button<Command<'TODO'>>
    preferImmediateRedirect: boolean
    webShowNewAutonavCountdown?: boolean
    webShowBigThumbnailEndscreen?: boolean
  } & Pick<
    BaseVideo,
    'title' | 'videoId' | 'publishedTimeText' | 'shortViewCountText' | 'thumbnailOverlays'
  >
>

// Player
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

export type VideoDetails = {
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
    title: Some<Text>
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

// Compact Video Continuation
type CompactContinuationResponse = BaseResponse & {
  onResponseReceivedEndpoints: [
    Action<
      'appendContinuationItems',
      { continuationItems: (CompactVideo | ContinuationItem)[]; targetId: string }
    >
  ]
}
