import { getSearch } from '@libs/fetch'
import { Grid } from '@components/lese'
import { VideoListItem } from '@components/Video/ListItem'
import { Video } from '@parser/types'
import { Component, createEffect, createSignal } from 'solid-js'
import { styled } from 'solid-styled-components'

const SearchContainer = styled('div')`
  display: flex;
  max-width: 1000px;
  margin: auto;

  padding: 24px;
`

export type SearchProps = {
  query: string
}

const Search: Component<SearchProps> = (props) => {
  const [getResults, setResults] = createSignal<Video[]>([])

  createEffect(() => props.query && setResults([]))

  createEffect(() =>
    getSearch(props.query).then((results) => {
      console.log(props.query, results)
      setResults(results)
    })
  )


  return (
    <SearchContainer>
      <Grid autoRows="220px" gap="24px">
        {getResults().map((video) => (
          <VideoListItem video={video} />
        ))}
      </Grid>
    </SearchContainer>
  )
}

export default Search
