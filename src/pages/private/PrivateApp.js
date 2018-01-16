import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { Sidebar, Menu } from 'semantic-ui-react';
import routes from './routes';

@inject('adminStore', 'authStore', 'userStore')
@withRouter
@observer
export default class PrivateApp extends React.Component {
  componentWillMount() {
    console.log(this.props.userStore.currentUser);
    this.props.authStore.verifySession();
  }

  render() {
    return (
      <div>
        <Switch>
          <Sidebar as={Menu} visible>
            <Menu.Item as={Link} to="/investor">Investor</Menu.Item>
          </Sidebar>
          {/* eslint-disable react/no-array-index-key */}
          {routes.map((route, index) => (
            <Route
              path={route.path}
              component={
                (route.auth) ?
                  route.auth(route.component, this.props) :
                  route.component
              }
              key={index}
            />
          ))}
        </Switch>
      </div>
    );
  }
}
