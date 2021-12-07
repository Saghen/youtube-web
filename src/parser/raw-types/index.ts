import { Thumbnail } from '../types'
import { AddToPlaylistRenderer, LikeToggleButtonRenderer, ShareButtonRenderer } from './buttons'

export type Accessibility<T = {}> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Accessibility<U>, Accessibility<V>>
  : {
      accessibility: {
        accessibilityData: {
          label: string
        }
      }
    } & T

export type NavigationEndpoint = ClickTracking<{
  browseEndpoint: {
    browseId: string
    canonicalBaseUrl: string
  }
  commandMetadata: {
    webCommandMetadata: {
      apiUrl: string
      rootVe: number
      url: string
      webPageType: string // "WEB_PAGE_TYPE_CHANNEL" is the only value ive noticed
    }
  }
}>

export type ReportFormServiceEndpoint = {
  params: string
}

export type SignalServiceEndpoint = {
  actions: ClickTracking<{
    changeEndgagementPanelVisibilityAction: {
      targetId: string
      visibility: string
    }
  }>[]
  signal: string
}

// TODO: Very likely this is incomplete and needs more generic typing
export type ServiceEndpoint<Endpoint extends SignalServiceEndpoint | ReportFormServiceEndpoint> =
  ClickTracking<
    {
      commandMetadata: {
        webCommandMetadata: {
          sendPost: true
          apiUrl?: string
        }
      }
    } & (Endpoint extends SignalServiceEndpoint
      ? {
          signalServiceEndpoint: Endpoint
        }
      : Endpoint extends ReportFormServiceEndpoint
      ? {
          getReportFormEndpoint: Endpoint
        }
      : never)
  >

export type Navigation<T> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Navigation<U>, Navigation<V>>
  : { navigationEndpoint: NavigationEndpoint } & T

export type Tracking<T> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Tracking<U>, Tracking<V>>
  : { trackingParams: string } & T

export type ClickTracking<T> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<ClickTracking<U>, ClickTracking<V>>
  : { clickTrackingParams: string } & T

export type SingleText = { simpleText: string }
export type ManyText = { text: string }
export type Text = SomeOptions<SingleText, ManyText>

export type Runs<T> = { runs: T[] }
export type Some<T extends SomeOptions> = T extends SomeOptions<infer Single, infer Many>
  ? Single | Runs<Many>
  : never
export type SomeOptions<T = {}, U = T> = { single: T; many: U }

export type MetadataBadge = Tracking<{
  icon: Icon<'CHECK_CIRCLE_THICK'> // "CHECK_CIRCLE_THICK" is the only value ive noticed
  style: string // "BADGE_STYLE_TYPE_VERIFIED" is the only value ive noticed
  tooltip: string // ex. Verified
}>

type Icon<Name extends string = string> = {
  iconType: Name
}

export type Style = {
  styledType: string
}

export type MenuServiceItem<
  Endpoint extends SignalServiceEndpoint | ReportFormServiceEndpoint =
    | SignalServiceEndpoint
    | ReportFormServiceEndpoint,
  IconName extends string = string
> = {
  menuServiceItemRenderer: Tracking<{
    icon: Icon<IconName>
    serviceEndpoint: ServiceEndpoint<Endpoint>
    text: Some<Text>
  }>
}

export type RawVideo = Navigation<{
  /** Thumbnails for channel */
  channelThumbnailSupportedRenderers: {
    channelThumbnailWithLinkRenderer: Navigation<{
      thumbnail: {
        thumbnails: Thumbnail[]
      }
    }>
  }

  /** Short version of description with ellipses */
  descriptionSnippet: Some<Text>

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
}>

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
  description: Some<Text>
  descriptionCollapsedLines: number

  owner: {
    videoOwnerRenderer: Navigation<{
      subscriberCountText: Some<Text>
      subscriptionButton: {
        type: 'FREE'
      }
      thumbnail: {
        thumbnails: {
          url: string
          width: number
          height: number
        }[]
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
