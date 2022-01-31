import { Component } from 'solid-js'
import { styled } from 'solid-styled-components'
import { colors } from '@constants'
import { Flex } from '@components/lese'

import { Link, TextSecondary, Title } from '../Typography'
import { NavLink } from '@rturnq/solid-router'
import { Thumbnail } from './Thumbnail'
import { ChannelIcon } from '../Channel/Link'
import { Video, VideoType } from '@parser/types'
import { LiveNow } from './Badge'

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
          <Flex column separation="6px">
            <Title lineClamp={2} style={{ 'margin-bottom': '2px' }}>
              {video.title}
            </Title>
            <NavLink href={video.author.url}>
              <Link secondary>{video.author.name}</Link>
            </NavLink>

            {video.type === VideoType.Live ? (
              <>
                <TextSecondary>{video.viewCountShortReadable} watching</TextSecondary>
                <LiveNow>LIVE NOW</LiveNow>
              </>
            ) : (
              <TextSecondary>
                {video.viewCountShortReadable} views • {video.relativePublishDate}
              </TextSecondary>
            )}
          </Flex>
        </Flex>
      </Flex>
    </NavLink>
  )
}
