import {
  Router as RouterCtx,
  MatchRoute,
  historyIntegration,
} from '@rturnq/solid-router'
import { createBrowserHistory } from 'history'

import { Switch } from 'solid-js'
import { Header } from './components/Header'

import Home from '@views/Home'
import Watch from '@views/Watch'
import Search from './views/Search'

export function Router() {
  return (
    <RouterCtx integration={historyIntegration(createBrowserHistory())}>
      <Header />
      <Switch fallback={<h1>404</h1>}>
        <MatchRoute end>
          <Home />
        </MatchRoute>
        <MatchRoute path="w/:id">{(route) => <Watch id={route.params.id} />}</MatchRoute>
        <MatchRoute path="s/:query">{(route) => <Search query={route.params.query} />}</MatchRoute>
      </Switch>
    </RouterCtx>
  )
}
