import { styled } from 'solid-styled-components'
import { BaseProps, GridProps, propertyGenerator } from 'lese'

import Base from './Base'

const getGridProperties = propertyGenerator<GridProps>([
  ['columns', { property: 'grid-template-columns' }],
  ['rows', { property: 'grid-template-rows' }],
  ['autoColumns', { property: 'grid-auto-columns' }],
  ['autoRows', { property: 'grid-auto-rows' }],
  ['columnGap', { property: 'grid-column-gap' }],
  ['rowGap', { property: 'grid-row-gap' }],
  ['gap', { property: 'grid-gap' }],
  [
    'xAlign',
    {
      handler: ({ xAlign }) => `justify-items: ${xAlign === true ? 'center' : xAlign}`,
    },
  ],
  [
    'yAlign',
    {
      handler: ({ yAlign }) => `align-items: ${yAlign === true ? 'center' : yAlign}`,
    },
  ],
  ['align', { property: 'place-items', default: 'center center' }],
])

// @ts-ignore Issue with prop typing?
const Grid = styled('div')<GridProps>`
  display: grid;
  ${getGridProperties}
`

export default Grid
