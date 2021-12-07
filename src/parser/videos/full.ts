import { PrimaryInfo, SecondaryInfo } from '@parser/raw-types'
import { FullVideo } from '@parser/types'
import {
  combineSomeText,
  mapNavigation,
  parseText,
  parseViewCount,
  someToArray,
  toShortHumanReadable,
} from '@parser/helpers'
import { pipe, prop } from 'ramda'
import { LikeStatuses } from '@parser/raw-types/buttons'

export function parseFullVideoData(
  id: string,
  [{ videoPrimaryInfoRenderer: primary }, { videoSecondaryInfoRenderer: secondary }]: [
    { videoPrimaryInfoRenderer: PrimaryInfo },
    { videoSecondaryInfoRenderer: SecondaryInfo }
  ]
): FullVideo {
  console.log(primary, secondary)

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
    description: someToArray(secondary.description),

    likes,
    likeStatus,

    relativePublishDate: combineSomeText(primary.dateText),

    viewCount: pipe(combineSomeText, parseViewCount)(viewCountRenderer.viewCount),
    viewCountReadable: combineSomeText(viewCountRenderer.shortViewCount),
    viewCountShortReadable: pipe(
      combineSomeText,
      parseViewCount,
      toShortHumanReadable
    )(viewCountRenderer.viewCount),
  }
}
