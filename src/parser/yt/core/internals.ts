import { head, pipe } from 'ramda'

// Some
export function someToArray<T, U>(value: Some<SomeOptions<T, U>>): (T | U)[] {
  if ('runs' in value) return value.runs
  return [value as T]
}

export const headOfSome = pipe(someToArray, head) as <T, U, V>(
  value: Some<SomeOptions<T, U>>
) => T | U

export type Runs<T> = { runs: T[] }
export type Some<T extends SomeOptions<{}, {}> | SubCommand> = T extends SomeOptions<
  infer Single,
  infer Many
>
  ? Single | Runs<Many>
  : never
export type SomeCommands<T extends SubCommand> = T extends Action
  ? { actions: T[] }
  : { commandExecutorCommand: { commands: T[] } }
export type SomeOptions<T, U> = { single: T; many: U }

// Renderer
export const findRenderer =
  <Name extends string>(name: Name) =>
  <Renderers extends Renderer>(
    renderers: Renderers[]
  ):
    | (Renderers extends Renderer<Name> ? (Renderers & Renderer<Name>)[`${Name}Renderer`] : never)
    | undefined =>
    // @ts-ignore
    renderers.find((renderer) => name in renderer)?.[`${name}Renderer`]

export const findRendererRaw =
  <Name extends string>(name: Name) =>
  <Renderers extends Renderer>(
    renderers: Renderers[]
  ): (Renderers extends Renderer<Name> ? Renderers & Renderer<Name> : never) | undefined =>
    // @ts-ignore
    renderers.find((renderer) => name in renderer)

export type Renderer<
  Name extends string = string,
  T extends Record<string, any> = Record<string, any>
> = {
  [K in `${Name}Renderer`]: T
} & { __typeName: 'renderer' }

// Command
export type SubCommand = Command | ServiceEndpoint | Endpoint | Action
export type OptionalSubCommand = SubCommand | undefined

export type Command<
  Name extends string = string,
  Properties extends Record<string, any> = {},
  SubCommand extends Command | ServiceEndpoint | Endpoint | Action | undefined = undefined
> = {
  [K in `${Name}Command`]: (SubCommand extends Command | ServiceEndpoint | Endpoint
    ? SubCommand // | { commandExecutorCommand: { commands: SubCommand[] } }
    : SubCommand extends Action
    ? SubCommand // | { actions: SubCommand[] }
    : {}) &
    // Partial<ClickTracking> &
    Properties
} & {
  __typeName: 'command'
}

export type CommandMetadata = {
  commandMetadata: WebCommandMetadata
} // & ClickTracking

type WebCommandMetadata = {
  sendPost: boolean
  url: string
  webPageType: string
  rootVe: number
  apiUrl: string
}

export type ServiceEndpoint<
  Name extends string = string,
  Properties extends Record<string, any> = {},
  SubCommand extends Command | ServiceEndpoint | Endpoint | Action | undefined = undefined
> = {
  [K in `${Name}ServiceEndpoint`]: (SubCommand extends Command | ServiceEndpoint | Endpoint
    ? SubCommand // | { commandExecutorCommand: { commands: SubCommand[] } }
    : SubCommand extends Action
    ? SubCommand // | { actions: SubCommand[] }
    : {}) &
    // Partial<ClickTracking> &
    Properties
} & {
  __typeName: 'serviceEndpoint'
}

export type Endpoint<
  Name extends string = string,
  Properties extends Record<string, any> = {},
  SubCommand extends Command | ServiceEndpoint | Endpoint | Action | undefined = undefined
> = {
  [K in `${Name}Endpoint`]: (SubCommand extends Command | ServiceEndpoint | Endpoint
    ? SubCommand // | { commandExecutorCommand: { commands: SubCommand[] } }
    : SubCommand extends Action
    ? SubCommand // | { actions: SubCommand[] }
    : {}) &
    // Partial<ClickTracking> &
    Properties
} & {
  __typeName: 'endpoint'
}

export type Action<
  Name extends string = string,
  Properties extends Record<string, any> = Record<string, any>
> = {
  [K in `${Name}Action`]: Properties // & Partial<ClickTracking>
} & {
  __typeName: 'action'
}

export type ExtractCommand<_Command extends any> = _Command extends Command<infer Name>
  ? { command: _Command[`${Name}Command`] }
  : _Command extends ServiceEndpoint<infer Name>
  ? { serviceEndpoint: _Command[`${Name}ServiceEndpoint`] }
  : _Command extends Endpoint<infer Name>
  ? { endpoint: _Command[`${Name}Endpoint`] }
  : _Command extends Action<infer Name>
  ? { action: _Command[`${Name}Action`] }
  : {}

export type ExtractRawCommand<_Command extends any> = _Command extends Command<infer Name>
  ? _Command[`${Name}Command`]
  : _Command extends ServiceEndpoint<infer Name>
  ? _Command[`${Name}ServiceEndpoint`]
  : _Command extends Endpoint<infer Name>
  ? _Command[`${Name}Endpoint`]
  : _Command extends Action<infer Name>
  ? _Command[`${Name}Action`]
  : {}
