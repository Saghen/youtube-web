import { colors } from '@constants'
import { Video } from '@libs/yt-parser'
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

    const abort = new AbortController()
    fetch(props.video.richThumbnails[0].url, { signal: abort.signal }).then((res) =>
      setCanShowRich(res.status !== 404)
    )

    return abort.abort
  })

  return (
    <ThumbnailContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={props.video.thumbnails[0].url} />
      {canShowRich() && (
        <img
          src={props.video.richThumbnails[0].url}
          style={{ opacity: +getIsHovered(), transition: 'opacity 0.1s ease 0.2s' }}
        />
      )}
    </ThumbnailContainer>
  )
}
