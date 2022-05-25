import { ChannelTab, ChannelTabName } from '@parser/yt/channel/types'
import { MetadataBadge } from '@parser/yt/components/badge'
import { SubscribeButton } from '@parser/yt/components/button'
import { ContinuationItem } from '@parser/yt/components/continuation'
import { RichGrid } from '@parser/yt/components/grid'
import { RichItem } from '@parser/yt/components/item'
import { TabWithIdentifier } from '@parser/yt/components/tab'
import { Text } from '@parser/yt/components/text'
import { Thumbnail } from '@parser/yt/components/thumbnail'
import { TwoColumnBrowseResults } from '@parser/yt/components/two-column'
import { Renderer, Some } from '@parser/yt/core'
import { BrowseEndpoint, Navigation } from '@parser/yt/utility/navigation'
import { Video } from '@parser/yt/video'
import { BaseResponse, Endpoint, fetchYt } from '../core'

export enum BrowseId {
  // Should be unneeded because of guide
  // Subscribed = 'FEchannels',
  Recommended = 'FEwhat_to_watch',
  History = 'FEhistory',
}

/** Must be escaped and converted to base64 */
export enum BrowseParams {
  ChannelHome = '\x12\bfeatured',
  ChannelVideos = '\x12\x06videos',
  ChannelPlaylists = '\x12\tplaylists',
  ChannelCommunity = '\x12\tcommunity',
  ChannelChannels = '\x12\bchannels',
  ChannelAbout = '\x12\x05about',
}

// Recommended
export const getRecommended = (): Promise<RecommendedResponse> =>
  fetchYt(Endpoint.Browse, { browseId: BrowseId.Recommended })

type RecommendedResponse = BaseResponse & {
  contents: TwoColumnBrowseResults<
    TabWithIdentifier<
      BrowseId.Recommended,
      RichGrid<RichItem<Video> | ContinuationItem, Renderer<'TODO'>>
    >
  >
  header: Renderer<'feedTabbedHeader', { title: Some<Text> }>
}

// Channel
export const getChannel = (channelId: string): Promise<ChannelResponse<ChannelTabName.Home>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelHome })
export const getChannelVideos = (
  channelId: string
): Promise<ChannelResponse<ChannelTabName.Videos>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelVideos })
export const getChannelPlaylists = (
  channelId: string
): Promise<ChannelResponse<ChannelTabName.Playlists>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelPlaylists })
export const getChannelChannels = (
  channelId: string
): Promise<ChannelResponse<ChannelTabName.Channels>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelChannels })
export const getChannelAbout = (
  channelId: string
): Promise<ChannelResponse<ChannelTabName.About>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelAbout })

type ChannelResponse<SelectedTab extends ChannelTabName> = BaseResponse & {
  contents: TwoColumnBrowseResults<ChannelTab<SelectedTab>>
  metadata: ChannelMetadata
  microformat: ChannelMicroFormat
  header: ChannelHeader
}

type ChannelHeader = Renderer<
  'c4TabbedHeader',
  {
    chnanelId: string

    title: string
    avatar: Thumbnail
    banner: Thumbnail
    tvBanner: Thumbnail
    mobileBanner: Thumbnail
    badges: MetadataBadge[]

    subscribeButton: SubscribeButton
    subscriberCountText: Some<Text>
  } & Navigation<BrowseEndpoint>
>

type ChannelMetadata = Renderer<
  'channelMetadata',
  {
    channelUrl: string
    vanityChannelUrl: string
    ownerUrls: string[]
    externalId: string

    avatar: Thumbnail
    title: string
    description: string
    keywords: string

    isFamilySafe: boolean
    availableCountryCodes: string[]
    androidDeepLink: string
    androidAppindexingLink: string
    iosAppindexingLink: string
    rssUrl: string
  }
>

type ChannelMicroFormat = Renderer<
  'microformatData',
  {
    urlCanonical: string
    title: string
    description: string
    thumbnail: Thumbnail
    noindex: boolean
    unlisted: boolean
    familySafe: boolean

    availableCountries: string[]
    siteName: 'YouTube'
    appName: 'YouTube'
    androidPackage: string
    iosAppStoreId: string
    iosAppArguments: string
    ogType: string
    urlApplinksWeb: string
    urlApplinksIos: string
    urlApplinksAndroid: string
    urlTwitterIos: string
    urlTwitterAndroid: string
    twitterCardType: string
    twitterSiteHandle: string
    schemaDotOrgType: string
    linkAlternatives: { hrefUrl: string }[]
  }
>
