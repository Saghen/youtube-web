import { User } from '../components/user'
import { Image } from '../components/image'
import { ProviderName } from '..'
import { Playlist } from '../playlist'
import { Video } from '../video'
import { Description } from '../components/description'

// TODO: How to handle twitch's panel?
/**
 * Includes all necessary information to render a channel page other than the videos and playlists
 * which should be fetched separately since it contains continuation data.
 */
export type Channel = {
  provider: ProviderName
  user: User
  id: string
  banner?: Image[]
  shortDescription?: string
  description?: Description

  featuredUsers?: User[]
  featuredPlaylists?: AsyncIterable<Playlist>
  /** Ex. trailer or hosted channel */
  featuredVideo?: Video
  featuredVideos?: AsyncIterable<Video>
  /** Ex. social media or discord server */
  featuredLinks?: AsyncIterable<string>
}
