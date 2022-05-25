import { Image } from './image'

export interface User {
  name: string
  id: string
  avatar: Image[]

  followerCount?: number
  followed?: boolean
}
