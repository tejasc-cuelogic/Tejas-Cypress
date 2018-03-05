import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { publicRoutes } from './../../modules/routes';
import Footer from './../../theme/layout/Footer';

export default class Public extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {publicRoutes.map(route => (
            <Route
              exact={route.exact ? route.exact : false}
              path={route.path}
              component={route.auth ?
                route.auth(route.component, this.props) : route.component}
              key={route.path}
            />
          ))}
        </Switch>
        {/* <div className="ui vertical segment content">
          <div className="ui container">
          </div>
        </div> */}
        <Footer />
      </div>
    );
  }
}
