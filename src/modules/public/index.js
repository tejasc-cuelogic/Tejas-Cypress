import React from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Route, Switch, matchPath } from 'react-router-dom';
// import { Segment, Grid } from 'semantic-ui-react';
import { publicRoutes } from './../../modules/routes';
// import { uiStore } from '../../services/stores';
import Footer from './../../theme/layout/Footer';

@inject('uiStore', 'navStore')
@observer
export default class Public extends React.Component {
  componentWillUpdate() {
    this.props.navStore.setNavStatus({}, 'main');
  }
  render() {
    const { location } = this.props;
    const NoFooter = [
      '/offerings/:id/:section', '/business-application', '/auth/:section',
    ];
    return (
      <Aux>
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
        {(!NoFooter.find(item => matchPath(location.pathname, { path: item }))) &&
          <Footer />
        }
      </Aux>
    );
  }
}
