import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateLayout';
import AllOfferings from './containers/AllOfferings';
import NewOffer from './components/NewOffer';
import OfferingDetails from './containers/OfferingDetails';

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
          <Route exact path={`${match.url}/:stage`} component={AllOfferings} />
          <Route exact path={`${match.url}/creation/new`} component={NewOffer} />
          <Route path={`${match.url}/:stage/edit/:offeringid`} render={props => <OfferingDetails refLink={match.url} {...props} />} />
        </Switch>
      </PrivateLayout>
    );
  }
}
