import { Some, SomeOptions, SingleText, ManyText, Text, Navigation } from './raw-types'
import {
  apply,
  curry,
  pipe,
  join,
  prop,
  map,
  head,
  split,
  filter,
  replace,
  cond,
  divide,
  __,
  concat,
  T,
  lte,
  dissoc,
} from 'ramda'

export function someToArray<T, U>(value: Some<SomeOptions<T, U>>): (T | U)[] {
  if ('runs' in value) return value.runs
  return [value as T]
}

export const headOfSome = pipe(someToArray, head) as <T, U>(value: Some<SomeOptions<T, U>>) => T | U

export function parseText<
  T extends
    | (SingleText & { [key in keyof ManyText]: never })
    | (ManyText & { [key in keyof SingleText]: never })
>(value: T): Omit<T, keyof SingleText> & ManyText {
  if ('simpleText' in value) return { ...dissoc('simpleText', value), text: value.simpleText }
  return value
}

export const mapNavigation = curry(
  <T, U extends {}>(
    callback: ({ id, baseUrl }: { id: string; baseUrl: string }) => T,
    value: Navigation<U>
  ): T =>
    callback({
      id: value.navigationEndpoint.browseEndpoint.browseId,
      baseUrl: value.navigationEndpoint.browseEndpoint.canonicalBaseUrl,
    })
)

export const parseViewCount = pipe(
  split(/([\d,]+)/),
  filter(Boolean),
  head,
  replace(/,/g, ''),
  Number
)

const divideByAndConcat = (divisor: number, suffix: string) => (num: number) =>
  pipe((val: number) => divide(val, divisor), Math.floor, String, concat(__, suffix))(num)

export const toShortHumanReadable = cond([
  [lte(1_000_000_000), divideByAndConcat(1_000_000_000, 'B')],
  [lte(1_000_000), divideByAndConcat(1_000_000, 'M')],
  [lte(1_000), divideByAndConcat(1_000, 'K')],
  [T, divideByAndConcat(1, '')],
]) as (viewCount: number) => string

/**
 * Text must be in the form "123,345 views"
 * Grabbed from richItemRenderer.content.videoRenderer.viewCountText
 */
export function humanReadableToNumber(text: string): number {
  return Number(
    text
      .split(/([\d,]+)/)
      .filter(Boolean)[0]
      .replaceAll(',', '')
  )
}

/**
 * Converts from "20:36" to the number of seconds.
 * Ex. 20:36 -> 20 * 60 + 36 -> 1236
 */
export function durationTextToSeconds(simpleText: string): number {
  return simpleText
    .split(':')
    .reverse() // Seconds, Minutes, Hours, etc..
    .map((val, i) => +val * 60 ** i) // Seconds 60 ** 0 (1), Minutes 60 ** 1 (60), etc...
    .reduce((a, b) => a + b, 0) // Add seconds together
}

export const combineSomeText = pipe(someToArray, map(parseText), map(prop('text')), join('')) as <T extends Some<Text> >(
  value: T
) => string

export const someTextToArray = <T extends Some<SomeOptions<SingleText, ManyText>>>(
  value: T
) => someToArray(value).map(parseText)

export const getNavigationId = <T, U>(some: Some<Navigation<SomeOptions<T, U>>>) => {
  const val = headOfSome(some) as Navigation<{}>
  return val.navigationEndpoint.browseEndpoint.browseId
}

export const getNavigationUrl = <T, U>(some: Some<Navigation<SomeOptions<T, U>>>) => {
  const val = headOfSome(some) as Navigation<{}>
  return val.navigationEndpoint.browseEndpoint.canonicalBaseUrl
}
