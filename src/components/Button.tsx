import { styled } from 'solid-styled-components'
import { TextSecondary } from './Typography'

export const SubscribeButton = () => <div></div>

const PaperButtonStyled = styled(TextSecondary)`
  display: inline-block;
  cursor: pointer;
`

export const PaperButton = (props: Parameters<typeof PaperButtonStyled>[0]) => (
  <PaperButtonStyled medium align upperCase fontSize="1.2rem" lineHeight="1.8rem" {...props} />
)
