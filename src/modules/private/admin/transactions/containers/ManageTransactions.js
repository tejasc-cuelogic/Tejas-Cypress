import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { Route, withRouter, Switch } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateHOC';
import AllTransactions from '../components/AllTransactions';

@withRouter
export default class ManageTransactions extends Component {
  componentWillMount() {
    const { match, history } = this.props;
    if (match.isExact) {
      history.push(`${match.url}/status-1`);
    }
  }
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout
        {...this.props}
        subNav
      >
        <Grid>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <Switch>
              <Route exact path={`${match.url}/:statusType`} component={AllTransactions} />
            </Switch>
          </Grid.Column>
        </Grid>
      </PrivateLayout>
    );
  }
}
