import { CommandMetadata, Endpoint, ExtractCommand, Renderer } from '../types/core'
import { BrowseEndpoint, Navigation } from '../utility/navigation'

// FIXME: Only checked to cover tab found on channels
export type Tab<Title extends string | undefined, Content extends Renderer> = Renderer<
  'tab',
  {
    content?: Content
    selected: boolean
    title: Title
  } & ExtractCommand<Endpoint<'', CommandMetadata, BrowseEndpoint>>
>

// FIXME: Only checked to cover expandable tab found on channels
export type ExpandableTab<Title extends string> = Renderer<
  'expandableTab',
  Navigation & {
    expandedText: ''
    selected: boolean
    title: Title
  }
>
