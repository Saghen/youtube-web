import { Channel } from './channel/types'
import { Comment } from './comment/types'
import { User } from './components/user'
import { Playlist } from './playlist'
import { Video } from './video'
import {  } from 'ix/iterable'
import { Player } from './player'

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
  getPlayer: (videoId: string) => Promise<Player>
  getVideo: (videoId: string) => Promise<Video>
  listVideos: (
    resourceType: ResourceType.Channel | ResourceType.Playlist
  ) => (id: string) => AsyncIterable<Video[]>
  setVideoLikeStatus?: (videoId: string) => (likeStatus: LikeStatus) => Promise<void>

  getUser: (userId: string) => Promise<User>
  listFollowedUsers: IdIfNotSelf<ResourceType.User, AsyncIterable<User[]>>
  listLiveFollowedUsers?: IdIfNotSelf<ResourceType.User, AsyncIterable<User[]>>
  setUserFollowed: (id: string) => (isFollowing: boolean) => Promise<void>

  getPlaylist: (playListId: string) => Promise<Playlist>
  listPlaylists: IdIfNotSelf<ResourceType.User, AsyncIterable<Playlist[]>>

  getChannel: (channelId: string) => Promise<Channel>

  getComment?: (commentId: string) => Promise<Comment>
  listComments?: (videoId: string) => AsyncIterable<Comment[]>

  search: <Type extends ResourceType>(
    resourceType: (ResourceType.Channel | ResourceType.Playlist | ResourceType.Video)[]
  ) => (query: string) => AsyncIterable<Resource<Type>[]>
}
