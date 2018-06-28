import React, { Component } from 'react';
import PrivateLayout from '../../../../containers/common/PrivateHOC';
import CreateNew from '../components/manage/CreateNew';

export default class UsersNew extends Component {
  render() {
    return (
      <PrivateLayout forceTitle="Create new User" {...this.props}>
        <CreateNew />
      </PrivateLayout>
    );
  }
}
