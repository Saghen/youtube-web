import { Command, CommandMetadata, Endpoint, Renderer } from '../core'

export type ContinuationItem = Renderer<
  'continuationItem',
  { trigger: string } & ContinuationEndpoint
>
export type ContinuationCommand = Command<'continuation', { token: string; request: string }>
export type ContinuationEndpoint = Endpoint<'continuation', ContinuationCommand & CommandMetadata>
