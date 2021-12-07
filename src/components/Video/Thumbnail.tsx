import { colors } from '@constants'
import { fetch } from '@libs/fetch'
import { Video } from '@parser/types/types'
import { Component, createEffect, createSignal } from 'solid-js'
import { styled } from 'solid-styled-components'

const ThumbnailContainer = styled('div')`
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

type ThumbnailProps = {
  video: Video
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={props.video.thumbnails[0].url} />
      <img
        src={props.video.richThumbnails?.[0].url}
        style={{
          opacity: canShowRich() && getIsHovered() ? 1 : 0,
          transition: getIsHovered() && 'opacity 250ms ease 250ms',
        }}
      />
    </ThumbnailContainer>
  )
}
