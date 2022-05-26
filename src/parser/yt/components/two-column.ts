import { Renderer } from '../core/internals'

export type TwoColumnBrowseResults<Tabs extends Renderer> = Renderer<
  'twoColumnBrowseResults',
  { tabs: Tabs[] }
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
