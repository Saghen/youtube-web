import { User } from '../components/user'
import { Image } from '../components/image'
import { ProviderName } from '..'
import { Playlist } from '../playlist'
import { Description } from '../components/description'

export enum VideoType {
  Live = 'live',
  Static = 'static',
}

export type Video = {
  provider: ProviderName

  type: VideoType
  id: string

  title: string
  shortDescription?: string
  description?: Description
  viewCount?: number

  author?: User

  /** The static and primary thumbnail for the video. An array of objects for various sizes */
  staticThumbnail: Image[]
  /** The animated thumbnail for the video. An array of objects for various sizes. Can be used for on-hover for example */
  animatedThumbnail?: Image[]

  /** Videos related to this video */
  relatedVideos?: AsyncIterable<Video>
  /** Channels related to this video */
  relatedUsers?: AsyncIterable<User>
  /** Playlists related to this video */
  relatedPlaylists?: AsyncIterable<Playlist>

  /** Length of the video or uptime of live stream in seconds */
  length?: number
  /** Length of the video in seconds that has already been viewed */
  viewedLength?: number
  /** Date that the video was uploaded or that the live stream started */
  publishDate?: Date
}

