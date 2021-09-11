import { styled } from 'solid-styled-components'
import { BaseProps, propertyGenerator } from 'lese'

const getTextProperties = propertyGenerator<BaseProps>([
  'color',
  'fontSize',
  ['textAlign', { default: 'center', property: 'text-align' }],
])
const getSizeProperties = propertyGenerator<BaseProps>([
  [
    'height',
    ({ responsive, height }) =>
      responsive ? `max-height: ${height}; height: 100%` : `height: ${height}`,
  ],
  [
    'width',
    ({ responsive, width }) =>
      responsive ? `max-width: ${width}; width: 100%` : `width: ${width}`,
  ],
])
const getLayoutProperties = propertyGenerator<BaseProps>([
  ['relative', () => 'position: relative'],
  'margin',
  'padding',
])

const Base = styled('div')<BaseProps>`
  ${getLayoutProperties}
  ${getSizeProperties}
  ${getTextProperties}
`

export default Base
