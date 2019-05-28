import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Inputs from './Inputs';
import Variables from './Variables';
import Results from './Results';

@withRouter
export default class Model extends Component {
  render() {
    const { match } = this.props;
    const navItems = [
      { title: 'Inputs', to: 'inputs', component: Inputs },
      { title: 'Variables', to: 'variables', component: Variables },
      { title: 'Results', to: 'results', component: Results },
    ];
    return (
      <div>
        <Switch>
          <Route exact path={match.url} component={navItems[0].component} />
          {
            navItems.map(item => (
              <Route exact key={item.to} path={`${match.url}/${item.to}`} component={item.component} />
            ))
          }
        </Switch>
      </div>
    );
  }
}
