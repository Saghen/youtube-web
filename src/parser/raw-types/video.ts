import { LikeToggleButton, SubscribeButton } from './components/button'
import { Text } from './components/text'
import { ChannelThumbnailWithLink, MovingThumbnail, Thumbnail } from './components/thumbnail'
import { Renderer, Some } from './core'
import { Accessibility } from './utility/accessibility'
import { BrowseEndpoint, Navigation, UrlEndpoint, WatchEndpoint } from './utility/navigation'
import { Tracking } from './utility/tracking'

export type Video = Navigation<WatchEndpoint> & {
  /** Badges that show on the thumbnail. Used to detect live streams */
  badges?: Renderer<MetadataBadge<'BADGE_STYLE_TYPE_LIVE_NOW', 'LIVE NOW'>>[]

  /** Thumbnails for channel */
  channelThumbnailSupportedRenderers: ChannelThumbnailWithLink

  /** Short version of description with ellipses. Not provided when description is not defined */
  descriptionSnippet?: Some<Text>

  /** Length of video info */
  lengthText: Some<Accessibility<Text>>

  /** Appears to be duplicate of ownerText which has the same info? */
  longBylineText: Some<Navigation<BrowseEndpoint, Text>>
  /** Appears to be duplicate of ownerText which has the same info? */
  shortBylineText: Some<Navigation<BrowseEndpoint, Text>>

  /** Excluded because I don't need it */
  menu: {}

  /** Verified and other badges */
  // FIXME: Should this be Renderer<MetadataBadge>[] ?
  ownerBadges: MetadataBadge[]

  /** Channel info */
  ownerText: Some<Navigation<BrowseEndpoint, Text>>

  /** How long ago the video was published. Ex. 3 days ago */
  publishedTimeText: Some<Text>

  /** Info for animated thumbnail on hover */
  richThumbnail: MovingThumbnail

  /** A more condensed version of view count. ex. 354k views */
  shortViewCountText: Some<Accessibility<Text>>

  /** Human readable view count. ex. 354,434 views */
  viewCountText: Some<Text>

  showActionMenu: boolean
  thumbnail: Thumbnail

  /**
   * Includes info for stuff like watch later.
   * Skipped because it will be unused
   */
  thumbnailOverlays: any[]

  title: Some<Accessibility<Text>>

  trackingParams: string
  videoId: string
}

type VideoViewCount = Renderer<
  'videoViewCount',
  {
    viewCount: Some<Text>
    shortViewCount: Some<Text>
  }
>

type SentimentBar = Renderer<
  'sentimentBar',
  {
    likeStatus: 'INDIFFERENT'
    percentIfDisliked: 98
    percentIfIndifferent: 98
    percentIfLiked: 98
    /** likes / dislikes Ex. 2,129 / 30 */
    tooltip: string
  }
>

type Menu<Items, TopLevelButtons> = Renderer<
  'menu',
  Accessibility &
    Tracking & {
      items: Items
      topLevelButtons: TopLevelButtons
    }
>

type VideoActions = Menu<
  MenuServiceItem[],
  [
    Renderer<LikeToggleButton>,
    Renderer<LikeToggleButton>,
    ShareButtonRenderer,
    AddToPlaylistRenderer
  ]
>

type VideoOwner = Renderer<
  'videoOwner',
  Navigation & {
    subscriberCountText: Some<Text>
    subscriptionButton: {
      type: 'FREE'
    }
    thumbnail: Thumbnail
    title: Some<Navigation<BrowseEndpoint, Text>>
  }
>

export type VideoPrimaryInfo = Renderer<
  'videoPrimaryInfo',
  {
    dateText: Some<Text>
    videoActions: VideoActions
    sentimentBar: SentimentBar
    title: Some<Text>
    viewCount: VideoViewCount
  }
>

export type VideoSecondaryInfo = Renderer<
  'videoSecondaryInfo',
  {
    description: Some<Navigation<UrlEndpoint | WatchEndpoint, Text>>
    descriptionCollapsedLines: number

    owner: VideoOwner
    showLessText: Some<Text>
    showMoreText: Some<Text>
    subscribeButton: Renderer<SubscribeButton>
  }
>

export type FullVideo = [VideoPrimaryInfo, VideoSecondaryInfo]

export type CompactVideo = Navigation<
  WatchEndpoint,
  Accessibility & {
    /** Thumbnails for channel */
    channelThumbnail: Thumbnail
  } & Pick<
      Video,
      | 'badges'
      | 'lengthText'
      | 'longBylineText'
      | 'menu'
      | 'publishedTimeText'
      | 'richThumbnail'
      | 'shortBylineText'
      | 'shortViewCountText'
      | 'thumbnail'
      | 'thumbnailOverlays'
      | 'title'
      | 'videoId'
      | 'viewCountText'
    >
>

export type GridVideo = Renderer<
  'gridVideo',
  Pick<
    Video,
    | 'badges'
    | 'menu'
    | 'navigationEndpoint'
    | 'ownerBadges'
    | 'publishedTimeText'
    | 'richThumbnail'
    | 'shortBylineText'
    | 'shortViewCountText'
    | 'thumbnail'
    | 'thumbnailOverlays'
    | 'title'
    | 'trackingParams'
    | 'videoId'
    | 'viewCountText'
  >
>
