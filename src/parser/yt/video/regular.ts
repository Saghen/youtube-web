import { VideoType } from '@parser/types'
import { getVideoType } from '.'
import { MetadataBadge } from '../components/badge'
import { ThumbnailOverlayToggleButton } from '../components/button'
import { combineSomeText, Text } from '../components/text'
import {
  ChannelThumbnailWithLink,
  MovingThumbnail,
  Thumbnail,
  ThumbnailOverlayNowPlaying,
  ThumbnailOverlayResumePlayback,
  ThumbnailOverlayTimeStatus,
} from '../components/thumbnail'
import { Renderer, ServiceEndpoint, Some } from '../core'
import { durationTextToSeconds, humanReadableToNumber, toShortHumanReadable } from '../helpers'
import { Accessibility } from '../utility/accessibility'
import {
  BrowseEndpoint,
  getBrowseNavigationId,
  getBrowseNavigationUrl,
  Navigation,
  NavigationSome,
  WatchEndpoint,
} from '../utility/navigation'

/**
 * Currently cannot parse/doesn't handle live streams and upcoming events
 */
export function processVideoData(video: Video): Video {
  const videoType = getVideoType(video)
  return {
    type: videoType,
    id: video.videoId,

    title: combineSomeText(video.title),
    shortDescription: video.descriptionSnippet ? combineSomeText(video.descriptionSnippet) : '',
    viewCount: humanReadableToNumber(combineSomeText(video.viewCountText)),
    viewCountReadable: combineSomeText(video.viewCountText),
    viewCountShortReadable: toShortHumanReadable(
      humanReadableToNumber(combineSomeText(video.viewCountText))
    ),

    author: {
      name: combineSomeText(video.ownerText),
      id: getBrowseNavigationId(video.ownerText),
      url:
        getBrowseNavigationUrl(video.ownerText) ?? `/c/${getBrowseNavigationId(video.ownerText)}`,
      thumbnail:
        video.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail
          .thumbnails[0],
    },

    thumbnails: video.thumbnail.thumbnails,
    richThumbnails: video.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails.thumbnails,

    ...(videoType === VideoType.Static && {
      length: durationTextToSeconds(combineSomeText(video.lengthText)),
      lengthReadable: combineSomeText(video.lengthText),
      relativePublishDate: combineSomeText(video.publishedTimeText),
    }),
  } as unknown as Video
}

export type Video = Navigation<WatchEndpoint> & {
  /** Badges that show on the thumbnail. Used to detect live streams */
  badges?: Renderer<MetadataBadge>[]

  /** Thumbnails for channel */
  channelThumbnailSupportedRenderers: ChannelThumbnailWithLink

  /** Short version of description with ellipses. Not provided when description is not defined */
  descriptionSnippet?: Some<Text>

  /** Length of video info */
  lengthText: Some<Accessibility<Text>>

  /** Appears to be duplicate of ownerText which has the same info? */
  longBylineText: Some<NavigationSome<BrowseEndpoint, Text>>
  /** Appears to be duplicate of ownerText which has the same info? */
  shortBylineText: Some<NavigationSome<BrowseEndpoint, Text>>

  /** Excluded because I don't need it */
  menu: {}

  /** Verified and other badges */
  // FIXME: Should this be Renderer<MetadataBadge>[] ?
  ownerBadges: MetadataBadge[]

  /** Channel info */
  ownerText: Some<NavigationSome<BrowseEndpoint, Text>>

  /** How long ago the video was published. Ex. 3 days ago */
  publishedTimeText: Some<Text>

  /** Info for animated thumbnail on hover */
  richThumbnail: MovingThumbnail

  /** A more condensed version of view count. Ex. 354k views */
  shortViewCountText: Some<Accessibility<Text>>

  /** Human readable view count. Ex. 354,434 views */
  viewCountText: Some<Text>

  showActionMenu: boolean
  thumbnail: Thumbnail

  /** Renderers that are overlayed on top of the thumbnail such as watch later and length */
  thumbnailOverlays: (
    | ThumbnailOverlayNowPlaying
    | ThumbnailOverlayResumePlayback
    | ThumbnailOverlayTimeStatus
  )[]

  title: Some<Accessibility<Text>>

  trackingParams: string
  videoId: string
}
