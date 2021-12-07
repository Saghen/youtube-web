import { Icon } from 'react-feather'
import { Accessibility, ClickTracking, SingleText, Some, Style, Text, Tracking } from '.'

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

type WebCommand<T> = ClickTracking<{
  commandMetadata: ApiCommandMetadata
}> &
  T

export type LikeStatuses = 'INDIFFERENT' | 'LIKE' | 'DISLIKE'

type ToggleButtonCommand = ClickTracking<{
  updateToggleButtonStateCommand: {
    toggled: boolean
    buttonId: string
  }
}>

type LikeCommand<Type extends 'likeParams' | 'dislikeParams' | 'removeLikeParams'> = WebCommand<{
  likeEndpoint: LikeAction<Type>
}>

type ShareCommand = WebCommand<{
  shareEntityServiceEndpoint: {
    commands: ClickTracking<{ openPopupAction: OpenPopupAction<SharePanelRenderer> }>[]
    serializedShareEntity: string
  }
}>

type AddToPlaylistCommand = WebCommand<{
  addToPlayListServiceEndpoint: { videoId: string }
}>

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
type SharePanelRenderer = {
  unifiedSharePanelRenderer: Tracking<{ showLoadingSpinner: boolean }>
}

// TODO: Could make generic for other ToggleButtons
export type ToggleButtonRenderer<DefaultCommands, ToggledCommands> = {
  toggleButtonRenderer: Tracking<
    Accessibility<{
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
    }>
  >
}

export type LikeToggleButtonRenderer = ToggleButtonRenderer<
  ToggleButtonCommand | LikeCommand<'likeParams' | 'dislikeParams'>,
  LikeCommand<'removeLikeParams'>
>

type ButtonRenderer<Command> = Tracking<{
  buttonRenderer: {
    accessibilityData: Accessibility
    icon: Icon
    isDisabled: boolean
    serviceEndpoint: Command
    size: string
    style: string
    text: Accessibility<SingleText>
    tooltip: string
  }
}>

export type ShareButtonRenderer = ButtonRenderer<ShareCommand>
export type AddToPlaylistRenderer = ButtonRenderer<AddToPlaylistCommand>
