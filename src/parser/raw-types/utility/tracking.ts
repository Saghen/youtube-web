import { SomeOptions } from "../core"

// TODO: Adopt the renderer, endpoint, command system?
export type Tracking<T = {}> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Tracking<U>, Tracking<V>>
  : { trackingParams: string } & T

export type ClickTracking<T = {}> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<ClickTracking<U>, ClickTracking<V>>
  : { clickTrackingParams: string } & T
