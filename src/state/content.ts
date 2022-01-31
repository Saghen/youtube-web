import { Video } from '@parser/types'
import { Store } from 'lacer'

export const ContentStore = new Store<{ videos: Video[] }>({ videos: [] })

/*window.addEventListener('message', (e) => {
  console.log(e.data)
  if (e.data?.type !== 'yt-data-loaded') return

  // beautiful
  // @ts-ignore
  console.log(
    // @ts-ignore
    globalThis.ytData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
      .richGridRenderer.contents
  )
  // @ts-ignore
  const videos = globalThis.ytData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.contents
    .map(
      // @ts-ignore
      (video) => video?.richItemRenderer?.content?.videoRenderer
    )
    .filter(Boolean)
    // @ts-ignore
    .filter((video) => !video.upcomingEventData)
    .map(parseVideoData)
  ContentStore.set((state) => (state.videos = videos))
  console.log(ContentStore.get())
})
*/
