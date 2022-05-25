import { dissoc, join, map, pipe, prop } from 'ramda'
import { Some, SomeOptions, someToArray } from '../core'
import { Navigation, UrlEndpoint, WatchEndpoint } from '../utility/navigation'

export function parseText<T extends SingleText, U extends ManyText>(
  value: T | U
): (Omit<T, keyof SingleText> & ManyText) | U {
  // @ts-ignore
  if ('simpleText' in value) return { ...dissoc('simpleText', value), text: value.simpleText }
  // @ts-ignore
  return value
}

export const someTextToArray = <T extends SingleText, U extends ManyText>(
  value: Some<SomeOptions<T, U>>
) => someToArray(value).map((run) => parseText<T, U>(run))

export const combineSomeText = pipe(someTextToArray, map(prop('text')), join('')) as <
  T extends Some<Text>
>(
  value: T
) => string

export const parseDescription = <
  T extends SingleText,
  U extends Navigation<UrlEndpoint | WatchEndpoint> & ManyText
>(
  value: Some<SomeOptions<T, U>>
): { text: string; href?: string }[] =>
  someTextToArray(value).map((run) =>
    'navigationEndpoint' in run
      ? {
          text: run.text,
          href: getNavigationUrl(run),
        }
      : { text: run.text }
  )

export type SingleText = { simpleText: string }
export type ManyText = { text: string }
export type Text = SomeOptions<SingleText, ManyText>
