import React, { Component } from 'react';
import PrivateLayout from '../../../shared/PrivateHOC';
import AllApplications from '../components/AllApplications';

export default class ManageApplications extends Component {
  search = (e) => {
    if (e.charCode === 13 && false) {
      // search goes here..
    }
  }
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout
        {...this.props}
      >
        <AllApplications match={match} />
      </PrivateLayout>
    );
  }
}
