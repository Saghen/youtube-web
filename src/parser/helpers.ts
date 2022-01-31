import {
  Some,
  SomeOptions,
  SingleText,
  ManyText,
  Text,
  Navigation,
  UrlEndpoint,
  WatchEndpoint,
  BrowseEndpoint,
} from './raw-types'

import {
  __,
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

// type NotSomeOptions<T> = T extends (T extends SomeOptions<{}, {}> ? never : T) ? T : never

export function parseText<T extends SingleText, U extends ManyText>(
  value: T | U
): (Omit<T, keyof SingleText> & ManyText) | U {
  // @ts-ignore
  if ('simpleText' in value) return { ...dissoc('simpleText', value), text: value.simpleText }
  // @ts-ignore
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
  pipe(
    (val: number) => divide(val, divisor),
    (val: number) => (divisor < 1_000_000 ? Math.floor(val) : val.toFixed(1)),
    String,
    concat(__, suffix)
  )(num)

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
  U extends Navigation<ManyText, UrlEndpoint | WatchEndpoint>
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

export const getBrowseNavigationId = <T, U>(some: Some<Navigation<SomeOptions<T, U>>>) => {
  const val = headOfSome(some) as Navigation<{}>
  return val.navigationEndpoint.browseEndpoint.browseId
}

/** General function for converting a navigation endpoint to a relative or absolute url */
export const getNavigationUrl = <T extends {}>(
  val: Navigation<{}, UrlEndpoint | BrowseEndpoint | WatchEndpoint> & T
) => {
  if ('urlEndpoint' in val.navigationEndpoint)
    return getUrlNavigationUrl(val as Navigation<{}, UrlEndpoint>)
  if ('browseEndpoint' in val.navigationEndpoint)
    return getBrowseNavigationUrl(val as Navigation<{}, BrowseEndpoint>)
  if ('watchEndpoint' in val.navigationEndpoint)
    return getWatchNavigationUrl(val as Navigation<{}, WatchEndpoint>)

  console.warn(
    'Unrecognized navigation endpoint with the following keys',
    Object.keys(val.navigationEndpoint)
  )
  return '#'
}

export const getBrowseNavigationUrl = <T, U>(some: Some<Navigation<SomeOptions<T, U>>>) => {
  const val = headOfSome(some) as Navigation<{}>
  return val.navigationEndpoint.browseEndpoint.canonicalBaseUrl
}

/** What a name */
export const getUrlNavigationUrl = <T, U>(
  some: Some<Navigation<SomeOptions<T, U>, UrlEndpoint>>
) => {
  const val = headOfSome(some) as unknown as Navigation<{}, UrlEndpoint>
  return val.navigationEndpoint.urlEndpoint.url
}

export const getWatchNavigationUrl = <T, U>(
  some: Some<Navigation<SomeOptions<T, U>, WatchEndpoint>>
) => {
  const val = headOfSome(some) as unknown as Navigation<{}, WatchEndpoint>
  return `/w/${val.navigationEndpoint.watchEndpoint.videoId}?t=${val.navigationEndpoint.watchEndpoint.startTimeSeconds}`
}

export const getWatchNavigationId = <T, U>(
  some: Some<Navigation<SomeOptions<T, U>, WatchEndpoint>>
) => {
  const val = headOfSome(some) as unknown as Navigation<{}, WatchEndpoint>
  return val.navigationEndpoint.watchEndpoint.videoId
}
