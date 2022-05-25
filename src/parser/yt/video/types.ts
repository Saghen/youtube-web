import { MetadataBadge } from '../components/badge'
import { LikeToggleButton, SubscribeButton } from '../components/button'
import { Text } from '../components/text'
import { ChannelThumbnailWithLink, MovingThumbnail, Thumbnail } from '../components/thumbnail'
import { Renderer, Some } from '../core'
import { Accessibility } from '../utility/accessibility'
import {
  BrowseEndpoint,
  Navigation,
  NavigationSome,
  UrlEndpoint,
  WatchEndpoint,
} from '../utility/navigation'
import { Tracking } from '../utility/tracking'



export type VideoViewCount = Renderer<
  'videoViewCount',
  {
    viewCount: Some<Text>
    shortViewCount: Some<Text>
  }
>

export type SentimentBar = Renderer<
  'sentimentBar',
  {
    likeStatus: 'INDIFFERENT'
    percentIfDisliked: 98
    percentIfIndifferent: 98
    percentIfLiked: 98
    /** likes / dislikes Ex. 2,129 / 30 */
    tooltip: string
  }
>

type Menu<Items, TopLevelButtons> = Renderer<
  'menu',
  Accessibility &
    Tracking & {
      items: Items
      topLevelButtons: TopLevelButtons
    }
>

export type VideoActions = Menu<
  MenuServiceItem[],
  [
    Renderer<LikeToggleButton>,
    Renderer<LikeToggleButton>,
    ShareButtonRenderer,
    AddToPlaylistRenderer
  ]
>

export type VideoOwner = Renderer<
  'videoOwner',
  Navigation & {
    subscriberCountText: Some<Text>
    subscriptionButton: {
      type: 'FREE'
    }
    thumbnail: Thumbnail
    title: Some<NavigationSome<BrowseEndpoint, Text>>
  }
>


