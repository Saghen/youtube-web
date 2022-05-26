import { MetadataBadge } from "../components/badge"
import { SubscribeButton } from "../components/button"
import { Text } from "../components/text"
import { Thumbnail } from "../components/thumbnail"
import { BrowseEndpoint, Navigation } from "../components/utility/navigation"
import { BaseResponse, BrowseParams, Endpoint, fetchYt } from "../core/api"
import { Renderer, Some } from "../core/internals"
import { Channel, ChannelTabName } from "./types"

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
  contents: Channel<SelectedTab>
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
