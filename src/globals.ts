import { glob } from 'solid-styled-components'
import { colors } from './constants'

glob`
  html {
    font-size: 10px;
  }

  body {
    margin: 0;

    background-color: ${colors.bg[500]};
    color: ${colors.text.primary};

    font-size: 1.4rem;

    --red: ${colors.red};
  }

  body, input, button {
    font-family: "Roboto", systemui, sans-serif;
  }

  a {
    text-decoration: none;
  }
`
