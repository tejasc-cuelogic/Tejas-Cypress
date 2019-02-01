import React, { Component } from 'react';
import PrivateLayout from '../../../shared/PrivateHOC';
import AllCategories from '../components/allCategories';


export default class ManageCategories extends Component {
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
        <AllCategories match={match} />
      </PrivateLayout>
    );
  }
}
