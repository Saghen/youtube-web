import { Channel } from './channel/types'
import { Comment } from './comment/types'
import { User } from './components/user'
import { Playlist } from './playlist'
import { Video } from './video'
import {  } from 'ix/iterable'

export type LikeStatus = 'INDIFFERENT' | 'LIKE' | 'DISLIKE'

export enum ProviderName {
  YT = 'yt',
  Twitch = 'twitch',
  Nebula = 'nebula',
  Curiosity = 'curiosity',
  Floatplane = 'floatplane',
}

export enum ResourceType {
  Channel = 'channel',
  Comment = 'comment',
  Playlist = 'playlist',
  Self = 'self',
  User = 'user',
  Video = 'video',
}

export type Resource<Type extends ResourceType> = Type extends ResourceType.Channel
  ? Channel
  : Type extends ResourceType.Comment
  ? Comment
  : Type extends ResourceType.Playlist
  ? Playlist
  : Type extends ResourceType.Self
  ? never
  : Type extends ResourceType.User
  ? User
  : Type extends ResourceType.Video
  ? Video
  : never

type IdIfNotSelf<ResourceTypes extends ResourceType, ReturnType> = <
  ResourceType extends ResourceType.Self | ResourceTypes
>(
  resourceType: ResourceType
) => ResourceType extends ResourceType.Self ? () => ReturnType : (id: string) => ReturnType

export type Provider = {
  // TODO:
  getRecommended?: () => AsyncIterable<(Video | { title: string; videos: Video[] })[]>

  // TODO:
  getPlayer: (id: string) => Promise<Player>
  getVideo: (id: string) => Promise<Video>
  listVideos: (
    resourceType: ResourceType.Channel | ResourceType.Playlist
  ) => (id: string) => AsyncIterable<Video[]>
  setVideoLikeStatus?: (id: string) => (likeStatus: LikeStatus) => Promise<void>

  getUser: (id: string) => Promise<User>
  listFollowedUsers: IdIfNotSelf<ResourceType.User, AsyncIterable<User[]>>
  listLiveFollowedUsers?: IdIfNotSelf<ResourceType.User, AsyncIterable<User[]>>
  setUserFollowed: (id: string) => (isFollowing: boolean) => Promise<void>

  getPlaylist: (id: string) => Promise<Playlist>
  listPlaylists: IdIfNotSelf<ResourceType.User, AsyncIterable<Playlist[]>>

  getChannel: (id: string) => Promise<Channel>

  getComment?: (id: string) => Promise<Comment>
  listComments?: (id: string) => AsyncIterable<Comment[]>

  search: <Type extends ResourceType>(
    resourceType: (ResourceType.Channel | ResourceType.Playlist | ResourceType.Video)[]
  ) => (query: string) => AsyncIterable<Resource<Type>[]>
}

const provider: Provider = {}
const iterator = provider.search([ResourceType.Channel])('hello')
