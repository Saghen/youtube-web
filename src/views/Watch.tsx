import { getVideo as fetchVideo } from '@libs/fetch'
import { ChannelIcon } from '@components/Channel/Icon'
import { Flex, Grid } from '@components/lese'
import { Text, TextSecondary, Title } from '@components/Typography'
import { FullVideo } from '@libs/yt-parser'
import { NavLink } from '@rturnq/solid-router'
import { Component, Switch, createResource, Match } from 'solid-js'
import { styled } from 'solid-styled-components'

const WatchInfo: Component<{ video: FullVideo }> = (props) => {
  return (
    <Flex
      column
      xAlign="space-between"
      separation="32px"
      style={{ 'max-width': '1200px', width: '100%', margin: 'auto', padding: '16px' }}
    >
      <Flex separation="12px" column>
        <Title fontSize="1.3em" regular>
          {props.video.title}
        </Title>
        <TextSecondary>
          {new Intl.NumberFormat().format(props.video.viewCount)} views •{' '}
          {props.video.relativePublishDate}
        </TextSecondary>
      </Flex>
      <Grid gap="16px" columns="auto 1fr auto" rows="auto auto" yAlign>
        <ChannelIcon size={48} channel={props.video.author} />
        <Flex column separation="4px">
          <NavLink href={props.video.author.url}>
            <Text medium>{props.video.author.name}</Text>
          </NavLink>
          <TextSecondary fontSize="0.9em">{props.video.author.subscriberCount}</TextSecondary>
        </Flex>
      </Grid>
    </Flex>
  )
}

const VideoContainer = styled('section')`
  overflow-y: auto;
  overflow-x: hidden;

  height: calc(100vh - 53px);

  > iframe {
    width: 100vw;
    height: min(90vh, calc(100vw / 16 * 9));
  }

  > * + * {
    margin-top: 16px;
  }
`

export type WatchProps = {
  id: string
}

const Watch: Component<WatchProps> = (props) => {
  const [video] = createResource(
    () => props.id,
    (query) => fetchVideo(query)
  )

  return (
    <VideoContainer>
      <iframe
        src={`https://www.youtube.com/embed/${props.id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        // @ts-ignore
        frameborder="0"
        allowfullscreen
      ></iframe>
      <Switch>
        <Match when={video.loading}>Loading...</Match>
        <Match when={video.error}>Failed while loading video data</Match>
        <Match when={video()}>{(video) => <WatchInfo video={video} />}</Match>
      </Switch>
    </VideoContainer>
  )
}

export default Watch
