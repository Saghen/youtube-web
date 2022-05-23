import { SomeOptions } from "../core"

export type SingleText = { simpleText: string }
export type ManyText = { text: string }
export type Text = SomeOptions<SingleText, ManyText>
