import React, { Component } from 'react';
import { Route, Switch, NavLink, withRouter } from 'react-router-dom';
import { List, Grid, Icon, Button } from 'semantic-ui-react';
import routes from '../routes';

import Portfolio from './Portfolio';

@withRouter
export default class Individual extends Component {
  render() {
    return (
      <div>
        <div>
          <div className="page-header-section">
            <Grid>
              <Grid.Row>
                <Grid.Column width={6}>
                  <h1>Individual Account</h1>
                </Grid.Column>
                <Grid.Column width={4} floated="right" textAlign="right">
                  <a className="item notification" href="#">
                    <Icon className="ns-bell" />
                    <span className="unread-count">3</span>
                  </a>
                  <Button primary floated="right">Invest Now</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
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
