import { string } from 'fp-ts'
import { LikeStatuses } from './raw-types/buttons'

export enum VideoType {
  Live = 'live',
  Static = 'static',
}

export type Video<Type extends VideoType = VideoType> = {
  type: Type
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
} & (Type extends VideoType.Static
  ? {
      /** Length of the video in seconds */
      length: number
      lengthReadable: string
      relativePublishDate: string
    }
  : {})

export type CompactVideo<Type extends VideoType = VideoType> = {
  type: Type
  id: string

  title: string
  viewCount: number
  viewCountReadable: string
  viewCountShortReadable: string
  author: Author

  thumbnails: Thumbnail[]
  richThumbnails?: Thumbnail[]
} & (Type extends VideoType.Static
  ? {
      /** Length of the video in seconds */
      length: number
      lengthReadable: string
      relativePublishDate: string
    }
  : {})

export type FullVideo<Type extends VideoType = VideoType> = {
  type: Type
  id: string

  title: string
  description: { text: string; href?: string }[]

  likeStatus: LikeStatuses
  likes: number

  /* Sadge
  dislikes: number
  */

  author: FullAuthor

  relativePublishDate: string

  relatedVideos: CompactVideo[]
} & (Type extends VideoType.Static
  ? {
      viewCount: number
      viewCountReadable: string
      viewCountShortReadable: string
    }
  : {})

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

/** Shows up in the grid view of playlists */
export type CompactPlaylist = {
  id: string
  title: string
  thumbnail: Thumbnail[]
  videoCount: number
}

/** Shows up on the home page of channels */
export type PlaylistPreview = CompactPlaylist & {
  /** Example: https://www.youtube.com/channel/UC-9b7aDP6ZN0coj9-xFnrtw */
  shortDescription?: string

  /** Incomplete list of videos in the playlist */
  videos: Video[]
  /** Video count cannot be provided */
  videoCount: never
}

/** Shows up when playing a video with an attached playlist or when viewing the playlist only view (which we wont support) */
export type Playlist = CompactPlaylist & {
  videos: Video[]
  author: Author
}

/**
 * Includes all necessary information to render a channel page other than the videos and playlists
 * which should be fetched separately since it contains continuation data.
 */
export type Channel = FullAuthor & {
  description: { text: string; href?: string }[]
  banner: Thumbnail[]

  featuredChannels: FullAuthor[]
  featuredPlaylists: PlaylistPreview[]

  /**
   * FIXME: Only shows up when the user has never watched the video.
   * Also appears to contain yet another variation of the video object
   */
  trailer?: Video<VideoType.Static>
}
