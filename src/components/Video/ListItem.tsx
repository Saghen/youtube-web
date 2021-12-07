import { Component } from 'solid-js'

import { Flex, Grid } from '@components/lese'

import { TextSecondary, Title } from '../Typography'
import { NavLink } from '@rturnq/solid-router'
import { Thumbnail } from './Thumbnail'
import { ChannelIconWithName } from '../Channel/Icon'
import { Video } from '@parser/types/types'

type VideoListItemProps = {
  video: Video
}

export const VideoListItem: Component<VideoListItemProps> = (props) => {
  const video = props.video
  return (
    <NavLink href={`/w/${video.id}`}>
      <Grid columns="calc(220px * 16 / 9) 1fr" gap="12px">
        <Thumbnail video={video} />

        <Flex column separation="12px">
          <Title lineClamp={2}>{video.title}</Title>
          <TextSecondary>
            {video.viewCountShortReadable} • {video.relativePublishDate}
          </TextSecondary>

          <ChannelIconWithName size={24} channel={video.author} />
          <TextSecondary>{video.shortDescription}</TextSecondary>
        </Flex>
      </Grid>
    </NavLink>
  )
}
