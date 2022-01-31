import { colors } from '@constants'
import { fetch } from '@libs/fetch'
import { Video, VideoType } from '@parser/types'
import { Component, createEffect, createSignal } from 'solid-js'
import { styled } from 'solid-styled-components'
import { Flex } from '@components/lese'

const TRANSITION = 'opacity 250ms ease 250ms'

const ThumbnailContainer = styled(Flex)`
  width: 100%;
  position: relative;

  &::before {
    display: block;
    content: '';
    width: 100%;
    padding-top: 56.25%;
    background-color: ${colors.bg[700]};
  }

  > img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
    width: 100%;
    will-change: transform;
  }
`

const Badge = styled('div')<{ background?: string; color?: string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 4px;
  background-color: ${({ background }) => background ?? colors.bg[200]}dd;
  color: ${({ color }) => color ?? colors.text.primary};
  padding: 3px 4px;
  border-radius: 2px;
  font-weight: 500;
  transition: ${TRANSITION};
`

const DurationContainer = styled('div')`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 4px;
  background-color: ${colors.bg[200]}dd;
  color: ${colors.text.primary};
  padding: 3px 4px;
  border-radius: 2px;
  font-weight: 500;
  transition: ${TRANSITION};
`

type ThumbnailProps = {
  video: Pick<Video, 'type' | 'thumbnails' | 'richThumbnails'> &
    Partial<Pick<Video, 'lengthReadable'>>
}

export const Thumbnail: Component<ThumbnailProps> = (props) => {
  const [getIsHovered, setIsHovered] = createSignal(false)
  const [canShowRich, setCanShowRich] = createSignal(false)

  createEffect(() => {
    if (!getIsHovered()) return
    if (!props.video.richThumbnails?.[0]) return

    const controller = new AbortController()
    fetch(props.video.richThumbnails[0].url, { signal: controller.signal }).then((res) =>
      setCanShowRich(res.status !== 404)
    )

    return controller.abort
  })

  return (
    <ThumbnailContainer
      relative
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={props.video.thumbnails[0].url} />
      <img
        src={props.video.richThumbnails?.[0].url}
        style={{
          opacity: canShowRich() && getIsHovered() ? 1 : 0,
          transition: getIsHovered() && TRANSITION,
        }}
      />
      {props.video.type === VideoType.Static && 'lengthReadable' in props.video && (
        <Badge
          style={{
            opacity: canShowRich() && getIsHovered() ? 0 : 1,
            transition: getIsHovered() && TRANSITION,
          }}
        >
          {props.video.lengthReadable}
        </Badge>
      )}
    </ThumbnailContainer>
  )
}
