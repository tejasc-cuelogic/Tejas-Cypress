import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SuspenseBoundary, lazyRetry } from '../../../../../../../theme/shared';

const getModule = component => lazyRetry(() => import(`./${component}`));

@withRouter
export default class Model extends Component {
  render() {
    const { match } = this.props;
    const navItems = [
      { title: 'Inputs', to: 'inputs', component: 'Inputs' },
      { title: 'Variables', to: 'variables', component: 'Variables' },
      { title: 'Results', to: 'results', component: 'Results' },
    ];
    return (
      <div>
        <SuspenseBoundary>
          <Switch>
            <Route exact path={match.url} component={getModule(navItems[0].component)} />
            {
              navItems.map(item => (
                <Route exact key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
              ))
            }
          </Switch>
        </SuspenseBoundary>
      </div>
    );
  }
}
