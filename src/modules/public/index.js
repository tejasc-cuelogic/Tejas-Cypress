import React from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Route, Switch, matchPath } from 'react-router-dom';
import { publicRoutes } from './../../modules/routes';
import Footer from './../../theme/layout/Footer';
import NotFound from '../shared/NotFound';

@inject('uiStore', 'navStore')
@observer
export default class Public extends React.Component {
  componentWillMount() {
    this.props.navStore.setNavStatus({}, 'main');
  }
  componentWillUpdate() {
    this.props.navStore.setNavStatus({}, 'main');
  }
  render() {
    const { location } = this.props;
    const NoFooter = [
      '/offerings/:id/:section?', '/business-application', '/auth/:section',
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
          <Route component={NotFound} />
        </Switch>
        {(!NoFooter.find(item => matchPath(location.pathname, { path: item }))) &&
          <Footer path={location.pathname} />}
      </Aux>
    );
  }
}
