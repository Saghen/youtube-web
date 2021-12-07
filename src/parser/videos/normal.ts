import {
  combineSomeText,
  durationTextToSeconds,
  getNavigationId,
  getNavigationUrl,
  humanReadableToNumber,
  toShortHumanReadable,
} from '@parser/helpers'
import { RawVideo } from 'parser/raw-types'
import { Video } from '@parser/types/types'

/**
 * Currently cannot parse/doesn't handle live streams and upcoming events
 */
export function parseVideoData(videoRenderer: RawVideo): Video {
  return {
    id: videoRenderer.videoId,

    title: combineSomeText(videoRenderer.title),
    shortDescription: combineSomeText(videoRenderer.descriptionSnippet),
    viewCount: humanReadableToNumber(combineSomeText(videoRenderer.viewCountText)),
    viewCountReadable: combineSomeText(videoRenderer.viewCountText),
    viewCountShortReadable: toShortHumanReadable(
      humanReadableToNumber(combineSomeText(videoRenderer.viewCountText))
    ),

    author: {
      name: combineSomeText(videoRenderer.ownerText),
      id: getNavigationId(videoRenderer.ownerText),
      url:
        getNavigationUrl(videoRenderer.ownerText) ??
        `/c/${getNavigationId(videoRenderer.ownerText)}`,
      thumbnail:
        videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail
          .thumbnails[0],
    },

    thumbnails: videoRenderer.thumbnail.thumbnails,
    richThumbnails:
      videoRenderer.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails.thumbnails,

    length: durationTextToSeconds(combineSomeText(videoRenderer.lengthText)),
    lengthReadable: combineSomeText(videoRenderer.lengthText),
    relativePublishDate: combineSomeText(videoRenderer.publishedTimeText),
  }
}
