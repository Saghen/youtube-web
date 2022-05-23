import { SubscribeButton } from "./components/button"
import { Grid, HorizontalList, ItemSection, SectionList, Shelf } from "./components/core"
import { ExpandableTab, Tab } from "./components/tab"
import { Thumbnail } from "./components/thumbnail"
import { Command, Renderer, Some } from "./core"
import { Accessibility } from "./utility/accessibility"
import { Navigation, UrlEndpoint, WatchEndpoint } from "./utility/navigation"
import { Text } from "./components/text"
import { ClickTracking } from "./utility/tracking"
import { GridVideo } from "./video"
import { MetadataBadge } from "./components/badge"

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

enum ChannelTabNames {
  Home = 'Home',
  Videos = 'Videos',
  Playlists = 'Playlists',
  Community = 'Community',
  Store = 'Store',
  Channels = 'Channels',
  About = 'About',
  Search = 'Search',
}

type HomeTab = Tab<
  ChannelTabNames.Home,
  SectionList<ChannelVideoPlayer | Shelf<HorizontalList<GridVideo> | HorizontalList<GridChannel>>>
>
type VideosTab = Tab<
  ChannelTabNames.Videos,
  SectionList<ItemSection<Grid<GridVideo | ContinuationItem>>>
>
type PlaylistsTab = Tab<ChannelTabNames.Playlists, Renderer<'TODO'>>
type CommunityTab = Tab<ChannelTabNames.Community, Renderer<'TODO'>>
type StoreTab = Tab<ChannelTabNames.Store, Renderer<'TODO'>>
type ChannelsTab = Tab<ChannelTabNames.Channels, Renderer<'TODO'>>
type AboutTab = Tab<ChannelTabNames.About, Renderer<'TODO'>>
type SearchExpandableTab = ExpandableTab<ChannelTabNames.Search>

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
    description: Some<Navigation<UrlEndpoint | WatchEndpoint, Text>>
    publishedTimeText: Some<Text>
    readMoreText: Some<Navigation<WatchEndpoint, Text>>
    title: Some<Accessibility<Navigation<WatchEndpoint, Text>>>
    videoId: string
    viewCountText: Some<Text>
  }
>

