import React, { Component } from 'react';
import PrivateLayout from '../../../shared/PrivateHOC';
import { ByKeyword as Search } from '../../../../../theme/form/Filters';
import AllMessages from '../components/AllMessages';

export default class ManageMessages extends Component {
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
        P1={<Search {...this.props} w={[9]} placeholder="Type keyword" executeSearch={this.search} />}
      >
        <AllMessages match={match} />
      </PrivateLayout>
    );
  }
}
