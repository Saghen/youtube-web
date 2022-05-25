import { Button } from '@parser/yt/components/button'
import { ContinuationItem } from '@parser/yt/components/continuation'
import { ItemSection } from '@parser/yt/components/core'
import { Text } from '@parser/yt/components/text'
import { Thumbnail } from '@parser/yt/components/thumbnail'
import { TwoColumnWatchNext } from '@parser/yt/components/two-column'
import { Command, Renderer, Some } from '@parser/yt/core'
import { CurrentVideoEndpoint } from '@parser/yt/utility/endpoints'
import {
  BrowseEndpoint,
  Navigation,
  NavigationSome,
  UrlEndpoint,
  WatchEndpoint,
} from '@parser/yt/utility/navigation'
import { CompactVideo, BaseVideo, VideoPrimaryInfo, VideoSecondaryInfo } from '@parser/yt/video'
import { BaseResponse, Endpoint, fetchYt } from '../core'

export const getVideo = (videoId: string): Promise<VideoResponse> =>
  fetchYt(Endpoint.Next, { videoId })

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
