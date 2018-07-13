import React, { Component } from 'react';
import PrivateLayout from '../../../shared/PrivateHOC';

export default class Referrals extends Component {
  render() {
    return (
      <PrivateLayout {...this.props}>
        <span className="infotext">Explore your Referrals...</span>
      </PrivateLayout>
    );
  }
}
