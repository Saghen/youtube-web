import { MetadataBadge, Renderer } from '@parser/raw-types'
import { VideoType } from '@parser/types'

export function getRawVideoType(video: {
  badges?: Renderer<MetadataBadge<string, string>>[]
}): VideoType {
  const isLive =
    'badges' in video &&
    video.badges?.some((badge) => badge.metadataBadgeRenderer.label === 'LIVE NOW')
  return isLive ? VideoType.Live : VideoType.Static
}
