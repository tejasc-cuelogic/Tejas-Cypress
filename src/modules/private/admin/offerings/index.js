import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateLayout';
import AllOfferings from './containers/AllOfferings';
import NewOffer from './components/NewOffer';

@inject('uiStore', 'navStore', 'offeringsStore')
@observer
export default class Repayments extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/creation`);
    }
  }

  render() {
    const { match } = this.props;
    return (
      <PrivateLayout
        {...this.props}
        subNav
      >
        <Switch>
          <Redirect from="/dashboard/offerings/edit/*" to="/dashboard/offerings/overview" />
          <Route exact path={`${match.url}/:stage`} component={AllOfferings} />
          <Route exact path={`${match.url}/creation/new`} component={NewOffer} />
        </Switch>
      </PrivateLayout>
    );
  }
}
