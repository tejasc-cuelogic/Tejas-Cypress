import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AllCrowdPay from '../components/AllCrowdPay';

export default class ManageCrowdPay extends Component {
  render() {
    const { match } = this.props;
    return (
      <Route exact path={`${match.url}/:type`} component={AllCrowdPay} />
    );
  }
}
