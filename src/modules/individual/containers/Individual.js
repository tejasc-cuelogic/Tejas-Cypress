import React, { Component } from 'react';
import { Route, Switch, NavLink, withRouter } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import routes from '../routes';

import Portfolio from './Portfolio';

@withRouter
export default class Individual extends Component {
  render() {
    return (
      <div>
        <div>
          <div className="secondary-menu">
            <List celled horizontal inverted>
              {
                routes.map(route => (
                  <List.Item>
                    <NavLink to={route.path}>{route.name}</NavLink>
                  </List.Item>
                ))
              }
            </List>
          </div>
        </div>
        <Switch>
          <Route exact path="/app/individual" component={Portfolio} />
          { /* eslint-disable arrow-body-style */ }
          {routes.map((route) => {
              return <Route key={route.path} path={route.path} component={route.component} />;
              })
          }
        </Switch>
      </div>
    );
  }
}
