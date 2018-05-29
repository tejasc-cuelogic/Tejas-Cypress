import React, { Component } from 'react';
import PrivateLayout from '../../../../containers/common/PrivateHOC';

export default class Messages extends Component {
  render() {
    return (
      <PrivateLayout {...this.props}>
        <span className="infotext">Explore your Messages...</span>
      </PrivateLayout>
    );
  }
}
