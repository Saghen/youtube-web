import { render } from 'solid-js/web'
import './globals'

import { Router } from './router'

render(Router, document.getElementById('root') as Node)
