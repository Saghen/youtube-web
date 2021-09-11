import { colors } from '@constants'
import { getSearch } from '@libs/fetch'
import { useRoute } from '@rturnq/solid-router'
import { Component, createEffect, createSignal, createState, on, onCleanup } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'
import { styled } from 'solid-styled-components'
import { Flex } from './lese'

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-search"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const SearchBarStyled = styled('input')<JSX.InputHTMLAttributes<HTMLInputElement>>`
  border: none;
  outline: none;
  border-radius: none;

  background-color: ${colors.bg[800]};
  color: ${colors.text.primary};

  padding: 8px 16px;
  min-width: 400px;
`

const SearchBarButton = styled('button')`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 24px;

  border: none;
  outline: none;
  border-radius: none;

  background-color: ${colors.bg[900]};
  color: ${colors.text.primary};
`

export type SearchBarProps = {
  onSearch: (query: string) => void
}

export const SearchBar: Component<SearchBarProps> = (props) => {
  const { params } = useRoute()
  const [getQuery, setQuery] = createSignal(params.query)
  const [getAbortController, setAbortController] = createSignal(new AbortController())

  createEffect(
    on(getQuery, () => {
      getAbortController().abort()
      const abortController = new AbortController()
      getSearch(getQuery(), { signal: abortController.signal }).catch(() => {})
      setAbortController(abortController)
    })
  )

  return (
    <Flex>
      <SearchBarStyled
        placeholder="Search..."
        value={getQuery()}
        // @ts-ignore
        onKeyDown={(e) => {
          e.keyCode === 13 && props.onSearch(e.target.value)
        }}
        // @ts-ignore
        onKeyUp={(e) => {
          setQuery(e.target.value)
        }}
      />
      <SearchBarButton>
        <SearchIcon />
      </SearchBarButton>
    </Flex>
  )
}
