import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateLayout';
import AllRepayments from './components/AllRepayments';
import PaymentDetails from './containers/PaymentDetails';

@inject('paymentStore')
@observer
export default class Repayments extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/issuers`);
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
          <Route exact path={`${match.url}/:paymentType`} component={AllRepayments} />
          <Route exact path={`${match.url}/:paymentType/:id`} render={props => <PaymentDetails {...props} refLink={this.props.match.url} />} />
        </Switch>
      </PrivateLayout>
    );
  }
}
