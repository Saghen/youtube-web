import { ServiceEndpoint, Endpoint, Renderer, OptionalSubCommand, Action } from '../core'
import { OpenPopupAction } from './actions'

export type SubscribeEndpoint = Endpoint<'subscribe', { channelIds: string[]; params: string }>

export type LikeStatuses = 'INDIFFERENT' | 'LIKE' | 'DISLIKE'
export type LikeEndpoint = Endpoint<
  'like',
  {
    /** The current like status */
    status: LikeStatuses

    /** The video to be liked or disliked */
    target: { videoId: string }

    /** One of likeParams, dislikeParams, removeLikeParams will be defined depending on the Like Status */
    likeParams?: string
    /** One of likeParams, dislikeParams, removeLikeParams will be defined depending on the Like Status */
    dislikeParams?: string
    /** One of likeParams, dislikeParams, removeLikeParams will be defined depending on the Like Status */
    removeLikeParams?: string
  }
>

export type ShareEntityServiceEndpoint<PopupAction extends OpenPopupAction<Renderer>> =
  ServiceEndpoint<'shareEntity', { serializedShareEntity: string }, PopupAction>

export type OfflineVideoEndpoint<SubCommand extends OptionalSubCommand = undefined> = Endpoint<
  'offlineVideo',
  { videoId: string },
  SubCommand
>

export type SignalServiceEndpoint<Signal extends string, Actions extends Action> = ServiceEndpoint<
  'signal',
  { signal: Signal },
  Actions
>
