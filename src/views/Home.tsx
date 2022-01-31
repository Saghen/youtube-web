import { createSignal } from 'solid-js'

import { ContentStore } from '@state/content'
import { Grid } from '@components/lese'
import { VideoCard } from '@components/Video/Card'
import { getHomePage } from '@libs/fetch'
import { Video } from '@parser/types'

export default function Home() {
  const [getVideos, setVideos] = createSignal<Video[]>(ContentStore.get().videos)
  const [getNextPage, setGetNextPage] = createSignal<typeof getHomePage>()

  getHomePage()
    .then(({ videos, getNextPage }) => {
      console.log(videos)
      setVideos(videos)
      return getNextPage()
    })
    .then(({ videos, getNextPage }) => {
      console.log(videos)
      setVideos([...getVideos(), ...videos])
      setGetNextPage(() => getNextPage)
    })

  return (
    <Grid columns="repeat(auto-fit,minmax(360px,1fr))" gap="48px 16px" style={{ margin: '24px' }}>
      {getVideos().map((video) => (
        <VideoCard video={video} />
      ))}
    </Grid>
  )
}
