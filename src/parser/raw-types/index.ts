export * from './video'

export type Accessibility<T = {}> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Accessibility<U>, Accessibility<V>>
  : {
      accessibility: {
        accessibilityData: {
          label: string
        }
      }
    } & T

/** Used for navigation within Youtube */
export type BrowseEndpoint = {
  browseEndpoint: {
    browseId: string
    canonicalBaseUrl: string
  }
}

/** Used for navigation outside of Youtube */
export type UrlEndpoint = {
  urlEndpoint: {
    nofollow: boolean
    target: string // Only seen 'TARGET_NEW_WINDOW'
    /** A youtube URL that redirects externally. Should calculate actual url from this */
    url: string // https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbDNfajZmYWFzN0dCLWg2MmFGZ3ZFUmIyQ2RBd3xBQ3Jtc0trdk1tVEFrNGlqdmNnQXB5VWxuMzVnVDlzbWpVanFFVlVKYk9NeDFnaGhCSUtEeXhoaWVxMU9XVHVOdGVwN1ZMajJWZUgwN0oyNTV4NGZqTkE3cmpEalQzN0JQN3dYSmZBemxYWjhaNU9XQXZCTGJ3cw&q=http%3A%2F%2FExtremitiesPodcast.com
  }
}

/** Used for links to other Youtube videos */
export type WatchEndpoint = {
  watchEndpoint: {
    startTimeSeconds: number
    videoId: string
    /** Incomplete */
    watchEndpointSupportedOnesieConfig: {}
  }
}

export type NavigationEndpoint<Endpoint> = ClickTracking<{
  commandMetadata: {
    webCommandMetadata: {
      apiUrl: string
      rootVe: number
      url: string
      webPageType: string // "WEB_PAGE_TYPE_CHANNEL" is the only value ive noticed
    }
  }
}> &
  Endpoint

export type ReportFormServiceEndpoint = {
  params: string
}

export type SignalServiceEndpoint = {
  actions: ClickTracking<{
    changeEndgagementPanelVisibilityAction: {
      targetId: string
      visibility: string
    }
  }>[]
  signal: string
}

// TODO: Very likely this is incomplete and needs more generic typing
export type ServiceEndpoint<Endpoint extends SignalServiceEndpoint | ReportFormServiceEndpoint> =
  ClickTracking<
    {
      commandMetadata: {
        webCommandMetadata: {
          sendPost: true
          apiUrl?: string
        }
      }
    } & (Endpoint extends SignalServiceEndpoint
      ? {
          signalServiceEndpoint: Endpoint
        }
      : Endpoint extends ReportFormServiceEndpoint
      ? {
          getReportFormEndpoint: Endpoint
        }
      : never)
  >

export type Navigation<T = {}, Endpoint = BrowseEndpoint> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Navigation<U, Endpoint>, Navigation<V, Endpoint>>
  : { navigationEndpoint: NavigationEndpoint<Endpoint> } & T

export type Tracking<T = {}> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Tracking<U>, Tracking<V>>
  : { trackingParams: string } & T

export type ClickTracking<T = {}> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<ClickTracking<U>, ClickTracking<V>>
  : { clickTrackingParams: string } & T

export type SingleText = { simpleText: string }
export type ManyText = { text: string }
export type Text = SomeOptions<SingleText, ManyText>

export type Runs<T> = { runs: T[] }
export type Some<T extends SomeOptions<{}, {}>> = T extends SomeOptions<infer Single, infer Many>
  ? Single | Runs<Many>
  : never
export type SomeOptions<T, U> = { single: T; many: U }

export type MetadataBadge = Tracking<{
  icon: Icon<'CHECK_CIRCLE_THICK'> // "CHECK_CIRCLE_THICK" is the only value ive noticed
  style: string // "BADGE_STYLE_TYPE_VERIFIED" is the only value ive noticed
  tooltip: string // ex. Verified
}>

type Icon<Name extends string = string> = {
  iconType: Name
}

export type Style = {
  styledType: string
}

export type MenuServiceItem<
  Endpoint extends SignalServiceEndpoint | ReportFormServiceEndpoint =
    | SignalServiceEndpoint
    | ReportFormServiceEndpoint,
  IconName extends string = string
> = {
  menuServiceItemRenderer: Tracking<{
    icon: Icon<IconName>
    serviceEndpoint: ServiceEndpoint<Endpoint>
    text: Some<Text>
  }>
}

export type Renderer<T extends Record<string, any> & RendererType<string>> = {
  [K in `${T['__type']}Renderer`]: T
}

export type RendererType<Name extends string> = { __type: Name }
