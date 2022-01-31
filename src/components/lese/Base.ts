import { styled } from 'solid-styled-components'
import { BaseProps, propertyGenerator } from 'lese'

const sizes = {
  compact: '1.2rem',
  normal: '1.4rem',
}

const getLayoutProperties = propertyGenerator<BaseProps & { size?: keyof typeof sizes }>([
  ['relative', () => 'position: relative'],
  'margin',
  'padding',
  'width',
  'height',
  [
    'size',
    ({ size }) => `
      font-size: ${sizes[size ?? 'normal']};
      line-height: 1.8rem;
    `,
  ],
])

const Base = styled('div')<BaseProps & { size?: keyof typeof sizes }>`
  ${getLayoutProperties}
`

export default Base
