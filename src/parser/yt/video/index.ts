import { VideoType } from '../../std'

import { MetadataBadge } from '../components/badge'
import { Renderer } from '../core'
export * from './types'

export function getVideoType(video: {
  badges?: Renderer<MetadataBadge>[]
}): VideoType {
  const isLive =
    'badges' in video &&
    video.badges?.some((badge) => badge.metadataBadgeRenderer.label === 'LIVE NOW')
  return isLive ? VideoType.Live : VideoType.Static
}

export * from './compact'
export * from './full'
export * from './grid'
export * from './regular'
