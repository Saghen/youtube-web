import { glob } from 'solid-styled-components'
import { colors } from './constants'

glob`
  body {
    margin: 0;

    background-color: ${colors.bg[500]};
    color: ${colors.text.primary};

    font-size: 14px;

    --red: ${colors.red};
  }

  body, input, button {
    font-family: "Roboto", systemui, sans-serif;
  }

  a {
    text-decoration: none;
  }
`

/*enum KeyEnum {
  Foo = 'bar',
}

const resolvers = {
  bar: async () => 1,
}

function runCb<T>(cb: () => Promise<T>): Promise<T> {
  return cb()
}

function runCbExtended<T extends () => Promise<any>>(cb: T): ReturnType<T> {
  return cb()
}

function runResolver<T extends KeyEnum>(key: T): ReturnType<typeof resolvers[T]> {
  return resolvers[key]()
}

type ReturnTypeAsync<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => Promise<infer K>
  ? K
  : T extends (...args: any[]) => infer K
  ? K
  : any

function runResolverAlternate<T extends KeyEnum>(key: T): ReturnType<typeof resolvers[T]> {
  return resolvers[key]()
}



type Await<T> = T extends Promise<infer U> ? U : T*/
