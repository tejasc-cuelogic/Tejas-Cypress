import React from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Route, Switch } from 'react-router-dom';
import { includes } from 'lodash';
// import { Segment, Container, Grid } from 'semantic-ui-react';
import { publicRoutes } from './../../modules/routes';
// import uiStore from '../../stores/uiStore';
import Footer from './../../theme/layout/Footer';

@inject('uiStore')
@observer
export default class Public extends React.Component {
  render() {
    const { location } = this.props;
    const NoFooterPages = [
      '/offerings/1/overview',
      '/offerings/1/about',
      '/offerings/1/investment-details',
      '/offerings/1/bonus-rewards',
      '/offerings/1/disclosures',
      '/offerings/1/comments',
      '/business-application',
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
        {(!includes(NoFooterPages, location.pathname) && !location.pathname.startsWith('/auth')) &&
          <Footer />
        }
      </Aux>
    );
  }
}
