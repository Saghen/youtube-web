import { Command, CommandMetadata, Endpoint, Renderer } from '../core/internals'

export type ContinuationItem = Renderer<
  'continuationItem',
  { trigger: string } & ContinuationEndpoint
>
export type ContinuationCommand = Command<'continuation', {
  /** The continuation token for use in subsequent requests */
  token: string;
  /** Type of continuation request. For example CONTINUATION_REQUEST_TYPE_BROWSE for browse requests */
  request: string
}>
export type ContinuationEndpoint = Endpoint<'continuation', ContinuationCommand & CommandMetadata>
