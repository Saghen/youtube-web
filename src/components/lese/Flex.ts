import { styled } from 'solid-styled-components'
import { FlexProps, propertyGenerator } from 'lese'

const getFlexProperties = propertyGenerator<FlexProps>([
  ['column', () => 'flex-direction: column'],
  [
    'xAlign',
    {
      default: 'center',
      handler: ({ column, xAlign }) =>
        column
          ? `align-items: ${typeof xAlign === 'boolean' ? 'center' : xAlign};`
          : `justify-content: ${typeof xAlign === 'boolean' ? 'center' : xAlign};`,
    },
  ],
  [
    'yAlign',
    {
      default: 'center',
      handler: ({ column, yAlign }) =>
        column
          ? `justify-content: ${typeof yAlign === 'boolean' ? 'center' : yAlign};`
          : `align-items: ${typeof yAlign === 'boolean' ? 'center' : yAlign};`,
    },
  ],
  [
    'separation',
    ({ column, separation }) => `
    > * + * {
      ${column ? `margin-top: ${separation};` : `margin-left: ${separation};`}
    }
    `,
  ],
  ['wrap', { default: 'wrap', property: 'flex-wrap' }],
])

// @ts-ignore Issue with prop typing?
const Flex = styled('div')<FlexProps>`
  display: flex;
  ${getFlexProperties};
`

export default Flex
