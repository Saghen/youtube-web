export interface Video {
  id: string

  title: string
  shortDescription: string
  viewCount: number
  viewCountReadable: string
  author: Author

  thumbnails: Thumbnail[]
  richThumbnails?: Thumbnail[]

  /** Length of the video in seconds */
  length: number
  lengthReadable: string
  relativePublishDate: string
}

export interface FullVideo {
  id: string

  title: string
  description: string

  viewCount: number
  viewCountReadable: string

  likeStatus: 'INDIFFERENT' | 'LIKE' | 'DISLIKE'
  likes: number
  dislikes: number

  author: FullAuthor

  relativePublishDate: string
}

export interface Author {
  name: string
  id: string
  thumbnail: Thumbnail
  /** Relative URL. Formatted /c/canonicalId */
  url: string
}

export interface FullAuthor extends Author {
  subscriberCount: string
  subscribed: boolean
  type: 'FREE'
}

export interface Thumbnail {
  /** Absolute url */
  url: string
  width: number
  height: number
}

/**
 * Text must be in the form "123,345 views"
 * Grabbed from richItemRenderer.content.videoRenderer.viewCountText
 */
export function viewCountTextToNumber(simpleText: string): number {
  return +simpleText
    .split(/([\d,]+)/)
    .filter(Boolean)[0]
    .replaceAll(',', '')
}

/**
 * Converts from "20:36" to the number of seconds.
 * Ex. 20:36 -> 20 * 60 + 36 -> 1236
 */
export function lengthTextToSeconds(simpleText: string): number {
  return simpleText
    .split(':')
    .reverse() // Seconds, Minutes, Hours, etc..
    .map((val, i) => +val * 60 ** i) // Seconds 60 ** 0 (1), Minutes 60 ** 1 (60), etc...
    .reduce((a, b) => a + b, 0) // Add seconds together
}

function combineRuns({ runs }: RawRuns) {
  return runs.map((run) => run.text).join('')
}

export function parseFullVideoData(
  id: string,
  [{ videoPrimaryInfoRenderer: primary }, { videoSecondaryInfoRenderer: secondary }]: [
    { videoPrimaryInfoRenderer: PrimaryInfo },
    { videoSecondaryInfoRenderer: SecondaryInfo }
  ]
): FullVideo {
  console.log(primary)
  const [likes, dislikes] = primary.sentimentBar.sentimentBarRenderer.tooltip
    .split('/')
    .map((val) => val.trim())
    .map(Number)

  const owner = secondary.owner.videoOwnerRenderer
  const subscription = secondary.subscribeButton.subscribeButtonRenderer
  const viewCountRenderer = primary.viewCount.videoViewCountRenderer

  return {
    id,
    author: {
      name: combineRuns(owner.title),
      id: owner.navigationEndpoint.browseEndpoint.browseId,
      url:
        owner.navigationEndpoint.browseEndpoint.canonicalBaseUrl ??
        `/c/${owner.navigationEndpoint.browseEndpoint.browseId}`,
      thumbnail: owner.thumbnail.thumbnails[0],

      subscribed: subscription.subscribed,
      subscriberCount: owner.subscriberCountText.simpleText,
      type: subscription.type,
    },

    title: combineRuns(primary.title),
    description: combineRuns(secondary.description),

    likes,
    dislikes,
    likeStatus: primary.sentimentBar.sentimentBarRenderer.likeStatus,

    relativePublishDate: primary.dateText.simpleText,

    viewCount: viewCountTextToNumber(viewCountRenderer.viewCount.simpleText),
    viewCountReadable: viewCountRenderer.shortViewCount.simpleText,
  }
}

/**
 * Currently cannot parse/doesn't handle live streams and upcoming events
 */
export function parseVideoData(videoRenderer: RawVideo): Video {
  return {
    id: videoRenderer.videoId,

    title: videoRenderer.title.runs[0].text,
    shortDescription: videoRenderer.descriptionSnippet?.runs[0].text ?? '',
    viewCount: viewCountTextToNumber(
      videoRenderer.viewCountText.simpleText ?? videoRenderer.viewCountText.runs[0].text
    ),
    viewCountReadable:
      videoRenderer.viewCountText.simpleText ??
      videoRenderer.viewCountText.runs.map((run) => run.text).join(''),
    author: {
      name: videoRenderer.ownerText.runs[0].text,
      id: videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
      url:
        videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl ??
        `/c/${videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId}`,
      thumbnail:
        videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail
          .thumbnails[0],
    },

    thumbnails: videoRenderer.thumbnail.thumbnails,
    richThumbnails:
      videoRenderer.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails.thumbnails,

    length: lengthTextToSeconds(videoRenderer.lengthText.simpleText),
    lengthReadable: videoRenderer.lengthText.simpleText,
    relativePublishDate: videoRenderer.publishedTimeText.simpleText,
  }
}

export type RawRuns<T = {}> = { runs: (T & { text: string })[] }

export interface RawAccessibility {
  accessibilityData: {
    label: string
  }
}

export interface RawNavigationEndpoint {
  browseEndpoint: {
    browseId: string
    canonicalBaseUrl: string
  }
  clickTrackingParams: string
  commandMetadata: {
    webCommandMetadata: {
      apiUrl: string
      rootVe: number
      url: string
      webPageType: string // "WEB_PAGE_TYPE_CHANNEL" is the only value ive noticed
    }
  }
}

export interface RawMetadataBadge {
  icon: {
    iconType: string // "CHECK_CIRCLE_THICK" is the only value ive noticed
  }
  style: string // "BADGE_STYLE_TYPE_VERIFIED" is the only value ive noticed
  tooltip: string // ex. Verified
  trackingParams: string
}

export interface RawVideo {
  /** Thumbnails for channel */
  channelThumbnailSupportedRenderers: {
    channelThumbnailWithLinkRenderer: {
      navigationEndpoint: RawNavigationEndpoint
      thumbnail: {
        thumbnails: Thumbnail[]
      }
    }
  }

  /** Short version of description with ellipses */
  descriptionSnippet: {
    runs: {
      text: string
    }[]
  }

  /** Length of video info */
  lengthText: {
    accessibility: RawAccessibility
    simpleText: string // 20:36
  }

  /** Appears to be duplicate of ownerText which has the same info? */
  longBylineText: {
    runs: {
      text: string
      navigationEndpoint: RawNavigationEndpoint
    }[]
  }
  /** Appears to be duplicate of ownerText which has the same info? */
  shortBylineText: {
    runs: {
      text: string
      navigationEndpoint: RawNavigationEndpoint
    }[]
  }

  menu: {
    // Excluded because I don't need it
  }

  /** Navigation endpoint of video */
  navigationEndpoint: RawNavigationEndpoint

  /** Verified and other badges */
  ownerBadges: RawMetadataBadge[]

  /** Channel info */
  ownerText: {
    runs: {
      text: string
      navigationEndpoint: RawNavigationEndpoint
    }[]
  }
  publishedTimeText: {
    simpleText: string // Ex. 3 days ago
  }

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

  /** A more condensed version of view count */
  shortViewCountText: {
    accessibility: RawAccessibility
    simpleText: string // ex. 354k views
  }
  viewCountText: {
    simpleText: string // ex. 354,434 views
  } & { runs: { text: string }[] }

  showActionMenu: boolean
  thumbnail: {
    thumbnails: Thumbnail[]
  }

  /**
   * Includes info for stuff like watch later.
   * Skipped because it will be unused
   */
  thumbnailOverlays: any[]

  title: {
    accessibility: RawAccessibility
    runs: {
      text: string
    }[]
  }

  trackingParams: string
  videoId: string
}

export interface PrimaryInfo {
  dateText: { simpleText: string }
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
  title: RawRuns
  viewCount: {
    videoViewCountRenderer: {
      viewCount: { simpleText: string }
      shortViewCount: { simpleText: string }
    }
  }
}

export interface SecondaryInfo {
  description: RawRuns
  descriptionCollapsedLines: number

  owner: {
    videoOwnerRenderer: {
      navigationEndpoint: RawNavigationEndpoint
      subscriberCountText: {
        simpleText: string
      }
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
      title: {
        runs: {
          text: string
          navigationEndpoint: RawNavigationEndpoint
        }[]
      }
    }
  }
  showLessText: {
    simpleText: string
  }
  showMoreText: {
    simpleText: string
  }
  subscribeButton: {
    subscribeButtonRenderer: {
      buttonText: RawRuns
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
