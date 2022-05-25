import { SomeOptions } from "../core"

export type Accessibility<T = {}> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Accessibility<U>, Accessibility<V>>
  : {
      accessibility: AccessibilityData
    } & T

export type AccessibilityData = {
  accessibilityData: {
    label: string
  }
}

export type BasicAccessibility = {
  accessibility: {
    label: string
  }
}
