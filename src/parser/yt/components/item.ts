import { Renderer } from '../core'

export type RichItem<Content extends Renderer> = Renderer<'richItem', { content: Content }>
