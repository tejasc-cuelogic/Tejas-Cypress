import React, { Component } from 'react';
import Aux from 'react-aux';
import AllCrowdPay from '../components/AllCrowdPay';

export default class ManageCrowdPay extends Component {
  render() {
    const { match } = this.props;
    return (
      <Aux>
        <AllCrowdPay match={match} />
      </Aux>
    );
  }
}
