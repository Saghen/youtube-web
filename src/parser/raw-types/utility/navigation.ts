import { Endpoint, SomeOptions } from '../core'

export type Navigation<
  NavigationEndpoint extends Endpoint = BrowseEndpoint,
  T = {}
> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Navigation<Endpoint, U>, Navigation<Endpoint, V>>
  : Endpoint<'navigation', NavigationEndpoint> & T

/** Used for navigation within Youtube */
export type BrowseEndpoint = Endpoint<'browse', { browseId: string; canonicalBaseUrl?: string }>

/** Used for links to other Youtube videos */
export type WatchEndpoint = Endpoint<
  'browse',
  {
    videoId: string
    startTimeSeconds?: number
    nofollow?: boolean
    params?: string
    playerParams?: string
  }
>
/** Used for navigation outside of Youtube */
export type UrlEndpoint = Endpoint<
  'url',
  {
    nofollow: boolean
    target: string // Only seen 'TARGET_NEW_WINDOW'
    /** A youtube URL that redirects externally. Should calculate actual url from this */
    url: string // https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbDNfajZmYWFzN0dCLWg2MmFGZ3ZFUmIyQ2RBd3xBQ3Jtc0trdk1tVEFrNGlqdmNnQXB5VWxuMzVnVDlzbWpVanFFVlVKYk9NeDFnaGhCSUtEeXhoaWVxMU9XVHVOdGVwN1ZMajJWZUgwN0oyNTV4NGZqTkE3cmpEalQzN0JQN3dYSmZBemxYWjhaNU9XQXZCTGJ3cw&q=http%3A%2F%2FExtremitiesPodcast.com
  }
>

// The following are sometimes a part of watch endpoint
// Not sure if they matter though
type WatchEndpointSupportedOnesieConfig = {
  watchEndpointSupportedOnesieConfig: {
    html5PlaybackOnesieConfig: {
      commonConfig: {
        url: string
      }
    }
  }
}

type WatchEndpointSupportedPrefetchContentConfig = {
  watchEndpointSupportedPrefetchConfig: {
    prefetchHintConfig: {
      prefetchPriority: 0
      countdownUiRelativeSecondsPrefetchCondition: -3
    }
  }
}
