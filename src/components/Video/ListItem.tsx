import { Component } from 'solid-js'

import { Flex, Grid } from '@components/lese'

import { TextSecondary, Title } from '../Typography'
import { NavLink } from '@rturnq/solid-router'
import { Thumbnail } from './Thumbnail'
import { ChannelIconWithName, ChannelLink, CompactChannelLink } from '../Channel/Link'
import { CompactVideo, Video, VideoType } from '@parser/types'
import { LiveNow } from './Badge'

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

type CompactVideoListItemProps = {
  video: CompactVideo
}

export const CompactVideoListItem: Component<CompactVideoListItemProps> = (props) => {
  const video = props.video
  return (
    <NavLink href={`/w/${video.id}`}>
      <Grid columns="calc(94px * 16 / 9) 1fr" gap="8px">
        <Thumbnail video={video} />

        <Flex column separation="4px ...0px" size="compact">
          <Title lineClamp={2}>{video.title}</Title>
          <CompactChannelLink channel={video.author} />
          {video.type === VideoType.Live ? (
            <>
              <TextSecondary>{video.viewCountShortReadable} watching</TextSecondary>
              <LiveNow>LIVE NOW</LiveNow>
            </>
          ) : (
            <TextSecondary>
              {video.viewCountShortReadable} views •{' '}
              {(video as CompactVideo<VideoType.Static>).relativePublishDate}
            </TextSecondary>
          )}
        </Flex>
      </Grid>
    </NavLink>
  )
}
