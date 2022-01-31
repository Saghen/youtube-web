import {
  combineSomeText,
  durationTextToSeconds,
  getBrowseNavigationId,
  getBrowseNavigationUrl,
  humanReadableToNumber,
  toShortHumanReadable,
} from '@parser/helpers'
import { RawVideo } from 'parser/raw-types/video'
import { Video, VideoType } from '@parser/types'
import { getRawVideoType } from './helpers'

/**
 * Currently cannot parse/doesn't handle live streams and upcoming events
 */
export function parseVideoData(video: RawVideo): Video {
  const videoType = getRawVideoType(video)
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
