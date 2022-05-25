import { Renderer, Some } from '../types/core'
import { Navigation } from '../utility/navigation'
import { Text } from './text'
import { Tracking } from '../utility/tracking'

export type Shelf<Content extends Renderer> = Renderer<
  'shelf',
  Tracking &
    Navigation & {
      title: Some<Text>
      subtitle: Some<Text>
      content: Content
      // TODO: playAllButton
    }
>

export type SectionList<Content extends Renderer> = Renderer<
  'sectionList',
  Tracking & {
    contents: Content[]
    subMenu?: {} // On Channel Videos tab
    targetId: string
  }
>

export type HorizontalList<Item extends Renderer> = Renderer<
  'horizontalList',
  Tracking & {
    items: Item[]
  }
>

export type ItemSection<Content extends Renderer, Identifier extends string> = Renderer<
  'itemSection',
  Tracking & {
    contents: Content[]
    sectionIdentifier: Identifier
  }
>
