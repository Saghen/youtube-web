import { CompactVideo } from '@parser/raw-types/video'
import { CompactVideo, VideoType } from '@parser/types'
import {
  combineSomeText,
  durationTextToSeconds,
  getBrowseNavigationId,
  getBrowseNavigationUrl,
  humanReadableToNumber,
  toShortHumanReadable,
} from '@parser/helpers'
import { getRawVideoType } from './helpers'

export function parseCompactVideoData(video: CompactVideo): CompactVideo {
  const videoType = getRawVideoType(video)

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

    ...(videoType === VideoType.Static && {
      length: durationTextToSeconds(combineSomeText(video.lengthText)),
      lengthReadable: combineSomeText(video.lengthText),
      relativePublishDate: combineSomeText(video.publishedTimeText),
      richThumbnails:
        video.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails.thumbnails,
    }),
  }
}
