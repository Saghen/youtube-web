import { Component, JSX } from 'solid-js'

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

  xAlign?: boolean | string // TODO: How to get type of style attribute?

  upperCase?: boolean
  capitalize?: boolean

  lineClamp?: number
}

const TextPropertyGenerator = propertyGenerator<TextProps>([
  ['color', { property: 'color' }],
  ['fontSize', { property: 'font-size' }],
  ['bold', () => 'font-weight: 700'],
  ['semiBold', () => 'font-weight: 600'],
  ['medium', () => 'font-weight: 500'],
  ['regular', () => 'font-weight: 400'],
  ['lineHeight', { property: 'line-height' }],
  ['fixedWidthNumbers', () => 'font-variant-numeric: tabular-nums'],
  ['xAlign', { property: 'text-align', default: 'center' }],
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

export const Text = styled('span')<TextProps>`
  color: ${({ color }) => color ?? colors.text.primary};
  ${TextPropertyGenerator}
`

export const TextPrimary = styled('span')<TextProps>`
  color: ${() => colors.text.primary};
  ${TextPropertyGenerator}
`

export const TextSecondary = styled('span')<TextProps>`
  color: ${() => colors.text.secondary};
  ${TextPropertyGenerator}
`

export const TextTertiary = styled('span')<TextProps>`
  color: ${() => colors.text.tertiary};
  ${TextPropertyGenerator}
`

export const TextQuaternary = styled('span')<TextProps>`
  color: ${() => colors.text.quaternary};
  ${TextPropertyGenerator}
`

export const Title: Component<TextProps & JSX.HTMLAttributes<JSX.HTMLAttributes<HTMLSpanElement>>> = (props) => <Text fontSize="1.1em" bold {...props} />

export const Link = styled('span')<
  { secondary?: boolean } & TextProps & JSX.AnchorHTMLAttributes<HTMLAnchorElement>
>`
  color: ${({ secondary }) => (secondary ? colors.text.secondary : colors.text.primary)};
  &:hover {
    color: ${colors.text.primary};
  }

  text-decoration: none;
  ${TextPropertyGenerator}
`
