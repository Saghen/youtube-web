import { createSignal } from 'solid-js'

import { ContentStore } from '@state/content'
import { Grid } from '@components/lese'
import { VideoCard } from '@components/Video/Card'
import { Video } from '@libs/yt-parser'
import { getHomePage } from '@libs/fetch'

export default function Home() {
  const [getVideos, setVideos] = createSignal<Video[]>(ContentStore.get().videos)
  const [getNextPage, setGetNextPage] = createSignal<typeof getHomePage>()

  getHomePage()
    .then(({ videos, getNextPage }) => {
      setVideos(videos)
      return getNextPage()
    })
    .then(({ videos, getNextPage }) => {
      setVideos([...getVideos(), ...videos])
      setGetNextPage(getNextPage)
    })

  return (
    <Grid columns="repeat(auto-fit,minmax(300px,1fr))" gap="24px" style={{ margin: '24px' }}>
      {getVideos().map((video) => (
        <VideoCard video={video} />
      ))}
    </Grid>
  )
}
