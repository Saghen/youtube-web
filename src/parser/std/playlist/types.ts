import { User } from '../components/user'
import { Image } from '../components/image'
import { Video } from '../video'
import { Description } from '../components/description'
import { ProviderName } from '..'

export type Playlist = {
  provider: ProviderName
  id: string
  title: string
  author?: User

  /** Example: https://www.youtube.com/channel/UC-9b7aDP6ZN0coj9-xFnrtw */
  shortDescription?: string
  description?: Description

  staticThumbnail: Image[]
  /** Probably unused? */
  animatedThumbnail?: Image[]

  videoCount?: number
  videos: AsyncIterable<Video>
}
