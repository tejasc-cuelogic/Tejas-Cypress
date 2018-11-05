import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateLayout';
import AllRepayments from './components/AllRepayments';
import RepaymentDetails from './containers/RepaymentDetails';

@inject('repaymentStore')
@observer
export default class Repayments extends Component {
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout
        {...this.props}
      >
        <Route exact path={match.url} component={AllRepayments} />
        <Route path={`${match.url}/:Id`} component={RepaymentDetails} />
      </PrivateLayout>
    );
  }
}
