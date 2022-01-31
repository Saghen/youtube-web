import { JSX } from 'solid-js'

import { colors } from '@constants'
import { styled } from 'solid-styled-components'
import { propertyGenerator } from 'lese'

type TextProps = {
  color?: string
  fontSize?: string

  bold?: boolean
  semiBold?: boolean
  medium?: boolean
  regular?: boolean

  lineHeight?: string
  fixedWidthNumbers?: boolean

  align?: boolean | string // TODO: How to get type of style attribute?

  upperCase?: boolean
  capitalize?: boolean

  lineClamp?: number
}

// TODO: Set lineHeight equal to fontSize?
const TextPropertyGenerator = propertyGenerator<TextProps>([
  ['color', { property: 'color' }],
  ['fontSize', { property: 'font-size' }],
  ['bold', () => 'font-weight: 700'],
  ['semiBold', () => 'font-weight: 600'],
  ['medium', () => 'font-weight: 500'],
  ['regular', () => 'font-weight: 400'],
  ['lineHeight', { property: 'line-height' }],
  ['fixedWidthNumbers', () => 'font-variant-numeric: tabular-nums'],
  // FIXME: Lese bug with { default: 'center', property: 'text-align' }?
  // ['align', { default: 'center', property: 'text-align' }],
  ['align', ({ align }) => `text-align: ${align === true ? 'center' : align}`],
  ['upperCase', () => 'text-transform: uppercase'],
  ['capitalize', () => 'text-transform: capitalize'],
  [
    'lineClamp',
    // Truly incredible piece of engineering
    // https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
    ({ lineClamp }) =>
      `-webkit-line-clamp: ${lineClamp};
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;`,
  ],
])

const defaultTextStyles = `
  letter-spacing: 0.3px;
`

export const Text = styled('span')<
  TextProps & JSX.HTMLAttributes<JSX.HTMLAttributes<HTMLSpanElement>>
>`
  color: ${({ color }) => color ?? colors.text.primary};
  ${defaultTextStyles}
  ${TextPropertyGenerator}
`

export const TextPrimary = styled('span')<TextProps>`
  color: ${() => colors.text.primary};
  ${defaultTextStyles}
  ${TextPropertyGenerator}
`

export const TextSecondary = styled('span')<TextProps>`
  color: ${() => colors.text.secondary};
  ${defaultTextStyles}
  ${TextPropertyGenerator}
`

export const TextTertiary = styled('span')<TextProps>`
  color: ${() => colors.text.tertiary};
  ${defaultTextStyles}
  ${TextPropertyGenerator}
`

export const TextQuaternary = styled('span')<TextProps>`
  color: ${() => colors.text.quaternary};
  ${defaultTextStyles}
  ${TextPropertyGenerator}
`

export const Title = (props: Parameters<typeof Text>[0]) => (
  <Text fontSize="1.2em" lineHeight='1.2em' bold {...props} />
)

export const Link = styled('a')<
  { secondary?: boolean } & TextProps & JSX.AnchorHTMLAttributes<HTMLAnchorElement>
>`
  color: ${({ secondary }) => (secondary ? colors.text.secondary : colors.text.accent)};
  &:hover {
    color: ${({ secondary }) => (secondary ? colors.text.primary : colors.text.accent)};
  }
  text-decoration: none;

  ${defaultTextStyles}
  ${TextPropertyGenerator}
`
