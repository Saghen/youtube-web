import { Thumbnail } from '../types'
import { AddToPlaylistRenderer, LikeToggleButtonRenderer, ShareButtonRenderer } from './buttons'
import {
  Accessibility,
  MenuServiceItem,
  MetadataBadge,
  Navigation,
  RendererType,
  Some,
  Text,
  Tracking,
  UrlEndpoint,
  WatchEndpoint,
} from '.'

export type RawVideo = Navigation<
  {
    /** Badges that show on the thumbnail. Used to detect live streams */
    badges?: {
      metadataBadgeRenderer: Tracking<{
        style: 'BADGE_STYLE_TYPE_LIVE_NOW'
        label: 'LIVE NOW'
      }>
    }[]

    /** Thumbnails for channel */
    channelThumbnailSupportedRenderers: {
      channelThumbnailWithLinkRenderer: Accessibility<
        Navigation<{
          thumbnail: {
            thumbnails: Thumbnail[]
          }
        }>
      >
    }

    /** Short version of description with ellipses. Not provided when description is not defined */
    descriptionSnippet?: Some<Text>

    /** Length of video info */
    lengthText: Some<Accessibility<Text>>

    /** Appears to be duplicate of ownerText which has the same info? */
    longBylineText: Some<Navigation<Text>>
    /** Appears to be duplicate of ownerText which has the same info? */
    shortBylineText: Some<Navigation<Text>>

    menu: {
      // Excluded because I don't need it
    }

    /** Verified and other badges */
    ownerBadges: MetadataBadge[]

    /** Channel info */
    ownerText: Some<Navigation<Text>>

    /** How long ago the video was published. Ex. 3 days ago */
    publishedTimeText: Some<Text>

    /** Info for animated thumbnail on hover */
    richThumbnail: {
      movingThumbnailRenderer: {
        enabledHoveredLogging: boolean
        enableOverlay: boolean
        movingThumbnailDetails: {
          thumbnails: Thumbnail[]
          logAsMovingThumbnail: boolean
        }
      }
    }

    /** A more condensed version of view count. ex. 354k views */
    shortViewCountText: Some<Accessibility<Text>>

    /** Human readable view count. ex. 354,434 views */
    viewCountText: Some<Text>

    showActionMenu: boolean
    thumbnail: {
      thumbnails: Thumbnail[]
    }

    /**
     * Includes info for stuff like watch later.
     * Skipped because it will be unused
     */
    thumbnailOverlays: any[]

    title: Some<Accessibility<Text>>

    trackingParams: string
    videoId: string
  },
  WatchEndpoint
>

export interface PrimaryInfo {
  dateText: Some<Text>
  videoActions: {
    menuRenderer: Accessibility<
      Tracking<{
        items: MenuServiceItem[]
        topLevelButtons: [
          LikeToggleButtonRenderer,
          LikeToggleButtonRenderer,
          ShareButtonRenderer,
          AddToPlaylistRenderer
        ]
      }>
    >
  }
  sentimentBar: {
    sentimentBarRenderer: {
      likeStatus: 'INDIFFERENT'
      percentIfDisliked: 98
      percentIfIndifferent: 98
      percentIfLiked: 98
      /** likes / dislikes Ex. 2,129 / 30 */
      tooltip: string
    }
  }
  title: Some<Text>
  viewCount: {
    videoViewCountRenderer: {
      viewCount: Some<Text>
      shortViewCount: Some<Text>
    }
  }
}

export interface SecondaryInfo {
  description: Some<Navigation<Text, UrlEndpoint | WatchEndpoint>>
  descriptionCollapsedLines: number

  owner: {
    videoOwnerRenderer: Navigation<{
      subscriberCountText: Some<Text>
      subscriptionButton: {
        type: 'FREE'
      }
      thumbnail: {
        thumbnails: Thumbnail[]
      }
      title: Some<Navigation<Text>>
    }>
  }
  showLessText: {
    simpleText: string
  }
  showMoreText: {
    simpleText: string
  }
  subscribeButton: {
    subscribeButtonRenderer: {
      buttonText: Some<Text>
      channelId: string
      enabled: boolean
      /** Omitted for now */
      notificationPreferenceButton: {
        subscriptionNotificationToggleButtonRenderer: {}
      }
      /** No idea what this is */
      showPreferences: boolean
      subscribed: boolean
      type: 'FREE'
    }
  }
}

export type RawCompactVideo = Navigation<
  Accessibility<
    {
      /** Thumbnails for channel */
      channelThumbnail: {
        thumbnails: Thumbnail[]
      }
    } & Pick<
      RawVideo,
      | 'badges'
      | 'lengthText'
      | 'longBylineText'
      | 'menu'
      | 'publishedTimeText'
      | 'richThumbnail'
      | 'shortBylineText'
      | 'shortViewCountText'
      | 'thumbnail'
      | 'thumbnailOverlays'
      | 'title'
      | 'videoId'
      | 'viewCountText'
    >
  >,
  WatchEndpoint
>

export type GridVideo = RendererType<'gridVideo'> & Pick<
  RawVideo,
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
