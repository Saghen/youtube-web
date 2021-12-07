import { Component } from 'solid-js'

import { Flex } from '@components/lese'

import { Link, TextSecondary, Title } from '../Typography'
import { NavLink } from '@rturnq/solid-router'
import { Thumbnail } from './Thumbnail'
import { ChannelIcon } from '../Channel/Icon'
import { Video } from '@parser/types/types'

type VideoCardProps = {
  video: Video
}

export const VideoCard: Component<VideoCardProps> = (props) => {
  const video = props.video
  return (
    <NavLink href={`/w/${video.id}`}>
      <Flex xAlign="stretch" column separation="12px">
        <Thumbnail video={video} />

        <Flex separation="12px">
          <ChannelIcon channel={video.author} />
          <Flex column separation="2px">
            <Title lineClamp={2} style={{ 'margin-bottom': '2px' }}>
              {video.title}
            </Title>
            <NavLink href={video.author.url}>
              <Link secondary>{video.author.name}</Link>
            </NavLink>

            <TextSecondary>
              {video.viewCountShortReadable} • {video.relativePublishDate}
            </TextSecondary>
          </Flex>
        </Flex>
      </Flex>
    </NavLink>
  )
}
