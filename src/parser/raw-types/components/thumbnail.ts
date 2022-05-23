import { Renderer } from '../core'
import { Accessibility } from '../utility/accessibility'
import { Navigation } from '../utility/navigation'

export type ThumbnailVariant = {
  /** Absolute url */
  url: string
  width: number
  height: number
}

export type Thumbnail = {
  thumbnails: ThumbnailVariant[]
}

export type MovingThumbnail = Renderer<
  'movingThumbnail',
  {
    enabledHoveredLogging: boolean
    enableOverlay: boolean
    movingThumbnailDetails: {
      thumbnails: ThumbnailVariant[]
      logAsMovingThumbnail: boolean
    }
  }
>

export type ChannelThumbnailWithLink = Renderer<
  'channelThumbnailWithLink',
  Accessibility &
    Navigation & {
      thumbnail: Thumbnail
    }
>
