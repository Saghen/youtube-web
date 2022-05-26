import { VideoType } from '../../std'
import {
  getVideo as getVideoAPI,
  getRecommended as getRecommendedAPI,
  getPlayer as getPlayerApi,
  getCompactVideoContinuation,
} from './api'

import { MetadataBadge } from '../components/badge'
import { findRendererRaw } from '../core/internals'
import { processFullVideo } from './processors/full'
import { makeContinuationIterator } from '@yt/core/api'
import { RichItem } from '@yt/components/item'
import { processVideo, Video } from './processors/regular'
import { processCompactVideo } from './processors/compact'
export * from './types'

export async function* getRecommended() {
  const recommendedVideosIterator = makeContinuationIterator((token) =>
    getRecommendedAPI(token).then(
      (response) =>
        response.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
          .richGridRenderer.contents
    )
  )
  for await (const recommendedVideos of recommendedVideosIterator) {
    yield recommendedVideos
      .filter((renderer): renderer is RichItem<Video> => 'richItemRenderer' in renderer)
      .map((renderer) => renderer.richItemRenderer.content)
      .map(processVideo)
  }
}

export async function getVideo(videoId: string) {
  const [videoResponse, playerResponse] = await Promise.all([
    getVideoAPI(videoId),
    getPlayerApi(videoId),
  ])

  const contents = videoResponse.contents.twoColumnWatchNextResults.results.results.contents
  const primaryInfo = findRendererRaw('videoPrimaryInfo')(contents)
  const secondaryInfo = findRendererRaw('videoSecondaryInfo')(contents)
  if (!primaryInfo || !secondaryInfo) {
    throw Error(
      'Failed to find primary and secondary info in the YT request. Something has gone wrong!'
    )
  }

  const video = processFullVideo(videoId, [primaryInfo, secondaryInfo], playerResponse.videoDetails)

  const relatedVideos =
    videoResponse.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results

  const relatedVideosIterator = makeContinuationIterator(async (token) =>
    !token
      ? relatedVideos
      : getCompactVideoContinuation(token).then(
          (response) =>
            response.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems
        )
  )

  return {
    ...video,
    relatedVideos: async function* () {
      for await (const relatedVideos of relatedVideosIterator) {
        yield relatedVideos.map(processCompactVideo)
      }
    },
  }
}

export function getVideoType(video: { badges?: MetadataBadge[] }): VideoType {
  const isLive =
    'badges' in video &&
    video.badges?.some((badge) => badge.metadataBadgeRenderer.label === 'LIVE NOW')
  return isLive ? VideoType.Live : VideoType.Static
}
