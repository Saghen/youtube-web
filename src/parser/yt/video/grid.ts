import * as std from '../../std'

import { findRenderer, Renderer } from '../core'
import { Video } from './regular'
import { combineSomeText } from '../components/text'
import { durationTextToSeconds, humanReadableToNumber, toShortHumanReadable } from '../helpers'

/**
 * Currently cannot parse/doesn't handle live streams and upcoming events
 */
export function processGridVideoData({ gridVideoRenderer: video }: GridVideo): std.Video {
  const lengthText = findRenderer('thumbnailOverlayTimeStatus')(video.thumbnailOverlays)?.text
  if (!lengthText) throw Error('Grid video did not contain thumbnail overlay time status')

  return {
    type: std.VideoType.Static,
    id: video.videoId,

    title: combineSomeText(video.title),
    viewCount: humanReadableToNumber(combineSomeText(video.viewCountText)),
    viewCountReadable: combineSomeText(video.viewCountText),
    viewCountShortReadable: toShortHumanReadable(
      humanReadableToNumber(combineSomeText(video.viewCountText))
    ),

    thumbnails: video.thumbnail.thumbnails,
    richThumbnails: video.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails.thumbnails,

    length: durationTextToSeconds(combineSomeText(lengthText)),
    lengthReadable: combineSomeText(lengthText),
    relativePublishDate: combineSomeText(video.publishedTimeText),
  }
}

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
