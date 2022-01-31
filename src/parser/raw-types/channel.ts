import {
  Accessibility,
  MetadataBadge,
  Navigation,
  Renderer,
  RendererType,
  Some,
  Text,
  Tracking,
  UrlEndpoint,
  WatchEndpoint,
} from '.'
import { GridVideo } from './video'

type Channel = Navigation<{
  channelId: string
  ownerBadges: MetadataBadge[]
  subscribeButton:
}>

type ChannelVideoPlayer = RendererType<'channelVideoPlayer'> & {
  description: Some<Navigation<Text, UrlEndpoint | WatchEndpoint>>
  publishedTimeText: Some<Text>
  readMoreText: Some<Navigation<Text, WatchEndpoint>>
  title: Some<Accessibility<Navigation<Text, WatchEndpoint>>>
  videoId: string
  viewCountText: Some<Text>
}

type Shelf = RendererType<'shelf'> &
  Tracking<
    Navigation<{
      title: Some<Text>
      subtitle: Some<Text>
      content: Renderer<HorizontalList<GridVideo | GridChannel>>
      // TODO: playAllButton
    }>
  >

type HorizontalList<Item extends RendererType<string>> = RendererType<'horizontalList'> &
  Tracking<{
    items: Renderer<Item>
  }>

type TabRenderer = Tracking<
  Navigation<{
    content: {
      sectionListRenderer: Tracking<{
        contents: {
          itemSectionRenderer: Tracking<{
            contents: (Renderer<ChannelVideoPlayer> | Renderer<Shelf>)[]
          }>
        }[]
        targetId: string
      }>
    }
    selected: boolean
    title: 'Home'
  }>
>
