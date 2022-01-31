import { Component, JSX } from 'solid-js'
import { styled } from 'solid-styled-components'
import { NavLink } from '@rturnq/solid-router'
import { Link } from '../Typography'
import { Flex } from '../lese'
import { colors } from '@constants'
import { Author } from '@parser/types'

// Channel Icon
type ChannelIconProps = {
  channel: Author
  size?: number
}

// Seems to be a bug with types? Removing the ImgHTMLAttributes makes alt and src undefined
const ChannelIconImage = styled('img')<{ size?: number } & JSX.ImgHTMLAttributes<HTMLImageElement>>`
  width: ${({ size }) => `${size ?? 36}px`};
  height: ${({ size }) => `${size ?? 36}px`};
  border-radius: 50%;

  background-color: ${colors.bg[700]};
`

export const ChannelIcon: Component<ChannelIconProps> = (props) => (
  <NavLink href={props.channel.url}>
    <ChannelIconImage size={props.size} src={props.channel.thumbnail.url} />
  </NavLink>
)

export const ChannelIconWithName: Component<ChannelIconProps> = (props) => (
  <NavLink href={props.channel.url}>
    <Flex yAlign separation="8px">
      <ChannelIconImage size={props.size} src={props.channel.thumbnail.url} />
      <Link secondary medium>
        {props.channel.name}
      </Link>
    </Flex>
  </NavLink>
)

export const ChannelLink: Component<Omit<ChannelIconProps, 'size'>> = (props) => (
  <NavLink href={props.channel.url}>
    <Link secondary medium>
      {props.channel.name}
    </Link>
  </NavLink>
)

export const CompactChannelLink: Component<Omit<ChannelIconProps, 'size'>> = (props) => (
  <NavLink href={props.channel.url}>
    <Link secondary>
      {props.channel.name}
    </Link>
  </NavLink>
)
