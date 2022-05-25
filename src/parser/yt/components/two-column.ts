import { Renderer } from '../core'
import { Tab } from './tab'

export type TwoColumnBrowseResults<Content extends Renderer> = Renderer<
  'twoColumnBrowseResults',
  { tabs: Tab<undefined, Content> }
>

export type TwoColumnWatchNext<Item extends Renderer, SecondaryItem extends Renderer> = {
  twoColumnWatchNextResults: {
    results: {
      results: {
        contents: Item[]
      }
    }
    secondaryResults: {
      secondaryResults: {
        results: SecondaryItem[]
      }
    }
    autoplay: {
      autoplay: {
        sets: Record<string, any>[] // TODO:
        countDownSecs: number
      }
    }
  }
}
