import { PrimaryInfo, RawCompactVideo, SecondaryInfo } from '@parser/raw-types/video'
import { FullVideo } from '@parser/types'
import {
  combineSomeText,
  mapNavigation,
  parseDescription,
  parseViewCount,
  toShortHumanReadable,
} from '@parser/helpers'
import { prop } from 'ramda'
import { LikeStatuses } from '@parser/raw-types/buttons'
import { parseCompactVideoData } from './compact'
import { getRawVideoType } from './helpers'

export function parseFullVideoData(
  id: string,
  [{ videoPrimaryInfoRenderer: primary }, { videoSecondaryInfoRenderer: secondary }]: [
    { videoPrimaryInfoRenderer: PrimaryInfo },
    { videoSecondaryInfoRenderer: SecondaryInfo }
  ],
  compactVideos: RawCompactVideo[] = []
): FullVideo {
  console.log('FULLVIDEO PARSE', primary, secondary, compactVideos)

  const likeButton = primary.videoActions.menuRenderer.topLevelButtons[0].toggleButtonRenderer
  const dislikeButton = primary.videoActions.menuRenderer.topLevelButtons[1].toggleButtonRenderer
  const likes = parseViewCount(likeButton.defaultText.accessibility.accessibilityData.label)

  const likeStatus: LikeStatuses = likeButton.isToggled
    ? 'LIKE'
    : dislikeButton.isToggled
    ? 'DISLIKE'
    : 'INDIFFERENT'

  const owner = secondary.owner.videoOwnerRenderer
  const subscription = secondary.subscribeButton.subscribeButtonRenderer
  const viewCountRenderer = primary.viewCount.videoViewCountRenderer

  // @ts-ignore
  return {
    id,
    author: {
      name: combineSomeText(owner.title),
      id: mapNavigation(prop('id'), owner),
      url: `/c/${mapNavigation(prop('id'), owner)}`,
      thumbnail: owner.thumbnail.thumbnails[0],

      subscribed: subscription.subscribed,
      subscriberCount: combineSomeText(owner.subscriberCountText),
      type: subscription.type,
    },

    title: combineSomeText(primary.title),
    description: parseDescription(secondary.description),

    likes,
    likeStatus,

    relativePublishDate: combineSomeText(primary.dateText),

    viewCount: parseViewCount(combineSomeText(viewCountRenderer.viewCount)),
    viewCountReadable: combineSomeText(viewCountRenderer.shortViewCount),
    viewCountShortReadable: toShortHumanReadable(
      parseViewCount(combineSomeText(viewCountRenderer.viewCount))
    ),

    relatedVideos: compactVideos.map(parseCompactVideoData),
  }
}
