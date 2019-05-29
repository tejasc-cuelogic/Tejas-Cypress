import React, { Component } from 'react';
import PrivateLayout from '../../../shared/PrivateLayout';
import ReferralsDetails from '../components/ReferralsDetails';

export default class Referrals extends Component {
  render() {
    return (
      <PrivateLayout {...this.props}>
        <ReferralsDetails />
      </PrivateLayout>
    );
  }
}
