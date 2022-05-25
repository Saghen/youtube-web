import { SubscribeButton } from '../components/button'
import { Grid, HorizontalList, ItemSection, SectionList, Shelf } from '../components/core'
import { ExpandableTab, Tab } from '../components/tab'
import { Thumbnail } from '../components/thumbnail'
import { Command, Renderer, Some } from '../core'
import { Accessibility } from '../utility/accessibility'
import { Navigation, NavigationSome, UrlEndpoint, WatchEndpoint } from '../utility/navigation'
import { Text } from '../components/text'
import { ClickTracking } from '../utility/tracking'
import { GridVideo } from '../video/types'
import { MetadataBadge } from '../components/badge'

export type Channel = {
  tabs: (
    | HomeTab
    | VideosTab
    | PlaylistsTab
    | CommunityTab
    | ChannelsTab
    | AboutTab
    | StoreTab
    | SearchExpandableTab
  )[]
}

export enum ChannelTabName {
  Home = 'Home',
  Videos = 'Videos',
  Playlists = 'Playlists',
  Community = 'Community',
  Store = 'Store',
  Channels = 'Channels',
  About = 'About',
  Search = 'Search',
}

type IsTabName<Expected extends ChannelTabName, Received extends ChannelTabName> = Received extends Expected ? true : false

export type ChannelTab<Selected extends ChannelTabName> =
  | HomeTab<IsTabName<ChannelTabName.Home, Selected>>
  | VideosTab<IsTabName<ChannelTabName.Videos, Selected>>
  | PlaylistsTab<IsTabName<ChannelTabName.Playlists, Selected>>
  | CommunityTab<IsTabName<ChannelTabName.Community, Selected>>
  | StoreTab<IsTabName<ChannelTabName.Store, Selected>>
  | ChannelsTab<IsTabName<ChannelTabName.Channels, Selected>>
  | AboutTab<IsTabName<ChannelTabName.About, Selected>>
  | SearchExpandableTab

export type HomeTab<Selected extends boolean> = Tab<
  ChannelTabName.Home,
  SectionList<ChannelVideoPlayer | Shelf<HorizontalList<GridVideo> | HorizontalList<GridChannel>>>,
  Selected
>
export type VideosTab<Selected extends boolean> = Tab<
  ChannelTabName.Videos,
  SectionList<ItemSection<Grid<GridVideo | ContinuationItem>, undefined>>,
  Selected
>
export type PlaylistsTab<Selected extends boolean> = Tab<
  ChannelTabName.Playlists,
  Renderer<'TODO'>,
  Selected
>
export type CommunityTab<Selected extends boolean> = Tab<
  ChannelTabName.Community,
  Renderer<'TODO'>,
  Selected
>
export type StoreTab<Selected extends boolean> = Tab<
  ChannelTabName.Store,
  Renderer<'TODO'>,
  Selected
>
export type ChannelsTab<Selected extends boolean> = Tab<
  ChannelTabName.Channels,
  Renderer<'TODO'>,
  Selected
>
export type AboutTab<Selected extends boolean> = Tab<
  ChannelTabName.About,
  Renderer<'TODO'>,
  Selected
>
export type SearchExpandableTab = ExpandableTab<ChannelTabName.Search>

// TODO: Move
type ContinuationItem = Renderer<
  'continuationItem',
  ClickTracking &
    Command<
      'continuation',
      {
        // FIXME: This is an incomplete list of types
        request: 'CONTINUATION_REQUEST_TYPE_BROWSE'
        token: string
      }
    >
>

type GridChannel = Renderer<
  'gridChannel',
  Navigation & {
    channelId: string
    ownerBadges: MetadataBadge[]
    subscribeButton: SubscribeButton
    subscriberCountText: Accessibility<Some<Text>>
    thumbnail: { thumbnails: Thumbnail[] }
    title: Some<Text>
    videoCountText: Some<Text> // FIXME: Seems to always be runs though
  }
>

type ChannelVideoPlayer = Renderer<
  'channelVideoPlayer',
  {
    description: Some<NavigationSome<UrlEndpoint | WatchEndpoint, Text>>
    publishedTimeText: Some<Text>
    readMoreText: Some<NavigationSome<WatchEndpoint, Text>>
    title: Some<Accessibility<NavigationSome<WatchEndpoint, Text>>>
    videoId: string
    viewCountText: Some<Text>
  }
>
