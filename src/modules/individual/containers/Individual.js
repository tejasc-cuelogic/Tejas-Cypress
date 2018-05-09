import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// import { List, Grid, Icon, Button } from 'semantic-ui-react';
// import routes from '../routes';
import PrivateLayout from '../../../containers/common/PrivateHOC';
import Portfolio from './Portfolio';

// @withRouter
export default class Individual extends Component {
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout {...this.props}>
        <Route path={match.url} component={Portfolio} />
      </PrivateLayout>
    );
  }
}
