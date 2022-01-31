import { Icon } from 'react-feather'
import {
  Accessibility,
  ClickTracking,
  Renderer,
  RendererType,
  SingleText,
  Some,
  Style,
  Text,
  Tracking,
} from '.'

/**
 * Looks like commands are structured like
 * commandExecutorCommand: {
 *  commands: Command[]
 * }
 * or
 * Command
 *
 * Could structure similar to runs
 */

/**
 * OK SO
 * Service Endpoints = Commands
 * Commands contain actions
 */

//------------
// Commands
//------------
type SomeCommands<Commands> =
  | {
      commandExecuterCommand: {
        commands: Commands[]
      }
    }
  | Commands

// TODO: likely incorrect for anything other than buttons under video
type ApiCommandMetadata = {
  webCommandMetadata: {
    sendPost: boolean
    apiUrl: string
  }
}

type WebCommand = ClickTracking & {
  commandMetadata: ApiCommandMetadata
}

export type LikeStatuses = 'INDIFFERENT' | 'LIKE' | 'DISLIKE'

type ToggleButtonCommand = ClickTracking & {
  updateToggleButtonStateCommand: {
    toggled: boolean
    buttonId: string
  }
}

type LikeCommand<Type extends 'likeParams' | 'dislikeParams' | 'removeLikeParams'> = WebCommand & {
  likeEndpoint: LikeAction<Type>
}

type ShareCommand = WebCommand & {
  shareEntityServiceEndpoint: {
    commands: (ClickTracking & { openPopupAction: OpenPopupAction<Renderer<SharePanel>> })[]
    serializedShareEntity: string
  }
}

type AddToPlaylistCommand = WebCommand & {
  addToPlayListServiceEndpoint: { videoId: string }
}

//------------
// Actions
//------------
type OpenPopupAction<Renderer> = { beReused: boolean; popup: Renderer; popupType: 'DIALOG' }

type LikeAction<Type extends 'likeParams' | 'dislikeParams' | 'removeLikeParams'> = {
  [key in Type]: string
} & {
  status: LikeStatuses
  // TODO: Likely incomplete
  target: { videoId: string }
}

//------------
// Renderers
//------------
type SubscribeButton = {
  buttonText: Some<Text>
  channelId: string
  enabled: boolean
  /** Omitted for now */
  notificationPreferenceButton: {
    subscriptionNotificationToggleButtonRenderer: {}
  }
  /** No idea what this is */
  showPreferences: boolean
  subscribed: boolean
  subscribedButtonText: Some<Text>
  /** No idea what this is */
  subscribedEntityKey: string
  type: 'FREE'
  unsubscribeButtonText: Some<Text>
  unsubscribedButtonText: Some<Text>
}

export type SharePanel = RendererType<'unifiedSharePane'> &
  Tracking & { showLoadingSpinner: boolean }

export type ToggleButton<DefaultCommands, ToggledCommands> = RendererType<'toggleButton'> &
  Tracking &
  Accessibility & {
    // FIXME: Something weird with the YT typings for accessibility here
    accessibility: { label: string }

    defaultIcon: Icon
    // TODO: Need generic
    defaultServiceEndpoint: ClickTracking<SomeCommands<DefaultCommands>>
    /** Text that shows up on the button. Ex. like count or "Share" */
    defaultText: Accessibility<SingleText>
    defaultTooltip: string

    isDisabled: boolean
    isToggled: boolean
    style: Style
    targetId: string
    // FIXME: Definitely incomplete
    toggleButtonSupportedData: {
      toggleButtonIdData: { id: string }
    }
    // TODO: Should use generic service endpoints
    toggledServiceEndpoint: ClickTracking<SomeCommands<ToggledCommands>>
    toggledStyle: Style
    /** Text that shows up on the button when toggled. Usually the same as the defaultText */
    toggledText: Accessibility<SingleText>
    toggledTooltip: string
  }

export type LikeToggleButton = ToggleButton<
  ToggleButtonCommand | LikeCommand<'likeParams' | 'dislikeParams'>,
  LikeCommand<'removeLikeParams'>
>

type Button<Command> = RendererType<'button'> &
  Tracking & {
    accessibilityData: Accessibility
    icon: Icon
    isDisabled: boolean
    serviceEndpoint: Command
    size: string
    style: string
    text: Accessibility<SingleText>
    tooltip: string
  }

export type ShareButtonRenderer = Renderer<Button<ShareCommand>>
export type AddToPlaylistRenderer = Renderer<Button<AddToPlaylistCommand>>
