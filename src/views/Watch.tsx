import {
  Component,
  Switch,
  createResource,
  Match,
  createEffect,
  createSignal,
  onMount,
} from 'solid-js'
import { styled } from 'solid-styled-components'
import { NavLink } from '@rturnq/solid-router'

import { not } from 'ramda'
import { getVideo as fetchVideo } from '@libs/fetch'
import { FullVideo } from '@parser/types'

import { Column, Flex, Grid } from '@components/lese'
import { Link, Text, TextSecondary, Title } from '@components/Typography'
import { ChannelIcon } from '@components/Channel/Link'
import { PaperButton } from '@components/Button'
import { CompactVideoListItem } from '@components/Video/ListItem'

const Description: Component<{ description: FullVideo['description'] }> = (props) => {
  const [requiresExpansion, setRequiresExpansion] = createSignal(false)
  const [isExpanded, setIsExpanded] = createSignal(false)
  let descriptionRef!: HTMLElement

  onMount(() => {
    if (descriptionRef?.children?.length > 0) {
      // TODO: Report bug where ref for nested element is stale
      setRequiresExpansion(
        descriptionRef.children[0].scrollHeight > descriptionRef.children[0].clientHeight
      )
    }
  })

  return (
    /* @ts-ignore */
    <Column ref={descriptionRef} separation="8px" xAlign="flex-start">
      {/* @ts-ignore */}
      <Text lineClamp={isExpanded() ? Infinity : 3}>
        {props.description.map((run) =>
          'href' in run ? (
            <Link href={run.href}>{run.text}</Link>
          ) : (
            <Text
              style={{
                'word-wrap': 'break-word',
                'white-space': 'pre-wrap',
                'word-break': 'break-word',
              }}
            >
              {run.text}
            </Text>
          )
        )}
      </Text>
      {requiresExpansion() && (
        <PaperButton onClick={() => setIsExpanded(not)}>
          {isExpanded() ? 'Show Less' : 'Show More'}
        </PaperButton>
      )}
    </Column>
  )
}

const WatchInfo: Component<{ video: FullVideo }> = (props) => (
  <Grid
    columns="auto 400px"
    yAlign="start"
    style={{ 'max-width': '1280px', width: '100%', margin: 'auto', padding: '24px' }}
  >
    <Flex column xAlign="space-between" separation="32px">
      <Flex separation="16px" column>
        <Title fontSize="1.4em" lineHeight="1.4em" regular>
          {props.video.title}
        </Title>
        <TextSecondary>
          {new Intl.NumberFormat().format('viewCount' in props.video ? props.video.viewCount : 0)}{' '}
          views • {props.video.relativePublishDate}
        </TextSecondary>
      </Flex>
      <Grid gap="16px" columns="auto 1fr" rows="auto auto">
        <ChannelIcon size={48} channel={props.video.author} />
        <Flex column separation="4px 24px">
          <NavLink href={props.video.author.url}>
            <Text medium>{props.video.author.name}</Text>
          </NavLink>
          <TextSecondary fontSize="0.9em">{props.video.author.subscriberCount}</TextSecondary>
          <Description description={props.video.description} />
        </Flex>
      </Grid>
    </Flex>
    <RelatedVideos video={props.video} />
  </Grid>
)

const RelatedVideos: Component<{ video: FullVideo }> = (props) => {
  return (
    <Column separation="8px">
      {props.video.relatedVideos.map((video) => (
        <CompactVideoListItem video={video} />
      ))}
    </Column>
  )
}

const VideoContainer = styled('section')`
  overflow-y: auto;
  overflow-x: hidden;

  height: calc(100vh - 53px);

  > iframe {
    width: 100vw;
    height: min(87vh, calc(100vw / 16 * 9));
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

  createEffect(() => console.log(video()))

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
