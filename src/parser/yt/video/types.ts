import { LikeToggleButton } from '../components/button'
import { Text } from '../components/text'
import { Thumbnail } from '../components/thumbnail'
import { Renderer, Some } from '../core/internals'
import { Accessibility } from '../components/utility/accessibility'
import { BrowseEndpoint, Navigation, NavigationSome } from '../components/utility/navigation'
import { Tracking } from '../components/utility/tracking'

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
    percentIfDisliked: number
    percentIfIndifferent: number
    percentIfLiked: number
    /** likes / dislikes Ex. 2,129 / 30. TODO: Check if this changed since dislikes disabled */
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
    LikeToggleButton,
    LikeToggleButton,
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
