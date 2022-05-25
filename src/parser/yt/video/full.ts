import * as std from "../../std"

import { prop } from "ramda"
import { SubscribeButton } from "../components/button"
import { combineSomeText, parseDescription, Text } from "../components/text"
import { Renderer, Some } from "../core"
import { parseViewCount, toShortHumanReadable } from "../helpers"
import { mapNavigation, NavigationSome, UrlEndpoint, WatchEndpoint } from "../utility/navigation"
import { SentimentBar, VideoActions, VideoOwner, VideoViewCount } from "./types"
import { processCompactVideo, CompactVideo } from './compact'
import { LikeStatuses } from "../utility/endpoints"

export function processFullVideo(
  id: string,
  fullVideo: FullVideo,
  relatedVideos: CompactVideo[] = []
): std.Video {
  const [{ videoPrimaryInfoRenderer: primary }, { videoSecondaryInfoRenderer: secondary }] =
    fullVideo
  console.log('FULLVIDEO PARSE', primary, secondary, relatedVideos)

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
    // FIXME: Get video type based on video properties
    type: std.VideoType.Static,
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

    relatedVideos: relatedVideos.map(processCompactVideo),
  }
}

export type FullVideo = [VideoPrimaryInfo, VideoSecondaryInfo]

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
    description: Some<NavigationSome<UrlEndpoint | WatchEndpoint, Text>>
    descriptionCollapsedLines: number

    owner: VideoOwner
    showLessText: Some<Text>
    showMoreText: Some<Text>
    subscribeButton: Renderer<SubscribeButton>
  }
>
