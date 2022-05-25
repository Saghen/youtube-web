import * as std from '../../std'

import { Video } from './regular'
import { getVideoType } from '.'
import { combineSomeText } from '../components/text'
import { Thumbnail } from '../components/thumbnail'
import { durationTextToSeconds, toShortHumanReadable, humanReadableToNumber } from '../helpers'
import { Accessibility } from '../utility/accessibility'
import {
  getBrowseNavigationId,
  getBrowseNavigationUrl,
  Navigation,
  WatchEndpoint,
} from '../utility/navigation'
import { Renderer } from '../core'

export function processCompactVideo({ compactVideoRenderer: video }: CompactVideo): std.Video {
  const videoType = getVideoType(video)

  return {
    type: videoType,
    id: video.videoId,

    title: combineSomeText(video.title),
    viewCount: humanReadableToNumber(combineSomeText(video.viewCountText)),
    viewCountReadable: combineSomeText(video.viewCountText),
    viewCountShortReadable: toShortHumanReadable(
      humanReadableToNumber(combineSomeText(video.viewCountText))
    ),

    author: {
      name: combineSomeText(video.longBylineText),
      id: getBrowseNavigationId(video.longBylineText),
      url:
        getBrowseNavigationUrl(video.longBylineText) ??
        `/c/${getBrowseNavigationId(video.longBylineText)}`,
      thumbnail: video.channelThumbnail.thumbnails[0],
    },

    thumbnails: video.thumbnail.thumbnails,

    ...(videoType === std.VideoType.Static && {
      length: durationTextToSeconds(combineSomeText(video.lengthText)),
      lengthReadable: combineSomeText(video.lengthText),
      relativePublishDate: combineSomeText(video.publishedTimeText),
      richThumbnails:
        video.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails.thumbnails,
    }),
  }
}

export type CompactVideo = Renderer<
  'compactVideo',
  Navigation<WatchEndpoint> &
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
