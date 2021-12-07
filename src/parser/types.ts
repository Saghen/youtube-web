import { LikeStatuses } from './raw-types/buttons'

export interface Video {
  id: string

  title: string
  shortDescription: string
  viewCount: number
  viewCountReadable: string
  viewCountShortReadable: string
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
  viewCountShortReadable: string

  likeStatus: LikeStatuses
  likes: number

  /* Sadge
  dislikes: number
  */

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
