import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateLayout';
import AllRepayments from './components/AllRepayments';
import RepaymentDetails from './containers/RepaymentDetails';

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
          <Route exact path={`${match.url}/:status`} component={AllRepayments} />
          <Route exact path={`${match.url}/:status/:id`} component={RepaymentDetails} />
        </Switch>
      </PrivateLayout>
    );
  }
}
