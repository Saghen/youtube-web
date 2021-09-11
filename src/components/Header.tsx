import { colors } from '@constants'
import { NavLink, Redirect, useRouter } from '@rturnq/solid-router'
import { createState } from 'solid-js'
import { styled } from 'solid-styled-components'
import { Flex } from './lese'
import { SearchBar } from './SearchBar'
import { Text } from './Typography'

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-menu"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  padding: 8px 24px;
`

export const Header = () => {
  const { push } = useRouter()

  return (
    <HeaderContainer>
      <Flex separation="24px">
        <HamburgerIcon />
        <NavLink href="/">
          <img src="/logo.svg" />
        </NavLink>
      </Flex>
      <SearchBar onSearch={(query) => push(`/s/${query.replace(/\s+/, '+')}`)} />
      <div
        style={{
          background: colors.bg[800],
          'border-radius': '50%',
          width: '32px',
          height: '32px',
        }}
      ></div>
    </HeaderContainer>
  )
}
