import React, { Component } from 'react';
import PrivateLayout from '../../../shared/PrivateHOC';
import AllTeam from '../components/AllTeam';

export default class ManageTeam extends Component {
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
        <AllTeam match={match} />
      </PrivateLayout>
    );
  }
}
