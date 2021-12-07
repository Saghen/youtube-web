// import { Accessibility, Navigation, Some, Text } from 'parser/raw-types'

// export interface Video {
//   id: string

//   title: string
//   shortDescription: string
//   viewCount: number
//   viewCountReadable: string
//   viewCountShortReadable: string
//   author: Author

//   thumbnails: Thumbnail[]
//   richThumbnails?: Thumbnail[]

//   /** Length of the video in seconds */
//   length: number
//   lengthReadable: string
//   relativePublishDate: string
// }

// export interface FullVideo {
//   id: string

//   title: string
//   description: string

//   viewCount: number
//   viewCountReadable: string
//   viewCountShortReadable: string

//   likeStatus: 'INDIFFERENT' | 'LIKE' | 'DISLIKE'
//   likes: number
//   dislikes: number

//   author: FullAuthor

//   relativePublishDate: string
// }

// export interface Author {
//   name: string
//   id: string
//   thumbnail: Thumbnail
//   /** Relative URL. Formatted /c/canonicalId */
//   url: string
// }

// export interface FullAuthor extends Author {
//   subscriberCount: string
//   subscribed: boolean
//   type: 'FREE'
// }

// export interface Thumbnail {
//   /** Absolute url */
//   url: string
//   width: number
//   height: number
// }

// export interface MetadataBadge {
//   icon: {
//     iconType: string // "CHECK_CIRCLE_THICK" is the only value ive noticed
//   }
//   style: string // "BADGE_STYLE_TYPE_VERIFIED" is the only value ive noticed
//   tooltip: string // ex. Verified
//   trackingParams: string
// }

// export type RawVideo = Navigation<{
//   /** Thumbnails for channel */
//   channelThumbnailSupportedRenderers: {
//     channelThumbnailWithLinkRenderer: Navigation<{
//       thumbnail: {
//         thumbnails: Thumbnail[]
//       }
//     }>
//   }

//   /** Short version of description with ellipses */
//   descriptionSnippet: Some<Text>

//   /** Length of video info */
//   lengthText: Some<Accessibility<Text>>

//   /** Appears to be duplicate of ownerText which has the same info? */
//   longBylineText: Some<Navigation<Text>>
//   /** Appears to be duplicate of ownerText which has the same info? */
//   shortBylineText: Some<Navigation<Text>>

//   /** Excluded because I don't need it */
//   menu: {}

//   /** Verified and other badges */
//   ownerBadges: MetadataBadge[]

//   /** Channel info */
//   ownerText: Some<Navigation<Text>>

//   /** How long ago the video was published. Ex. 3 days ago */
//   publishedTimeText: Some<Text>

//   /** Info for animated thumbnail on hover */
//   richThumbnail: {
//     movingThumbnailRenderer: {
//       enabledHoveredLogging: boolean
//       enableOverlay: boolean
//       movingThumbnailDetails: {
//         thumbnails: Thumbnail[]
//         logAsMovingThumbnail: boolean
//       }
//     }
//   }

//   /** A more condensed version of view count. ex. 354k views */
//   shortViewCountText: Some<Accessibility<Text>>

//   /** Human readable view count. ex. 354,434 views */
//   viewCountText: Some<Text>

//   showActionMenu: boolean
//   thumbnail: {
//     thumbnails: Thumbnail[]
//   }

//   /**
//    * Includes info for stuff like watch later.
//    * Skipped because it will be unused
//    */
//   thumbnailOverlays: any[]

//   title: Some<Accessibility<Text>>

//   trackingParams: string
//   videoId: string
// }>

// export interface PrimaryInfo {
//   dateText: Some<Text>
//   sentimentBar: {
//     sentimentBarRenderer: {
//       likeStatus: 'INDIFFERENT'
//       percentIfDisliked: number
//       percentIfIndifferent: number
//       percentIfLiked: number
//       /** likes / dislikes Ex. 2,129 / 30 */
//       tooltip: string
//     }
//   }
//   title: Some<Text>
//   viewCount: {
//     videoViewCountRenderer: {
//       viewCount: Some<Text>
//       shortViewCount: Some<Text>
//     }
//   }
// }

// export interface SecondaryInfo {
//   description: Some<Text>
//   descriptionCollapsedLines: number

//   owner: {
//     videoOwnerRenderer: Navigation<{
//       subscriberCountText: Some<Text>
//       subscriptionButton: {
//         type: 'FREE'
//       }
//       thumbnail: {
//         thumbnails: {
//           url: string
//           width: number
//           height: number
//         }[]
//       }
//       title: Some<Navigation<Text>>
//     }>
//   }
//   showLessText: Some<Text>
//   showMoreText: Some<Text>
//   subscribeButton: {
//     subscribeButtonRenderer: {
//       buttonText: Some<Text>
//       channelId: string
//       enabled: boolean
//       /** Omitted for now */
//       notificationPreferenceButton: {
//         subscriptionNotificationToggleButtonRenderer: {}
//       }
//       /** No idea what this is */
//       showPreferences: boolean
//       subscribed: boolean
//       type: 'FREE'
//     }
//   }
// }

export {}
