import React, { Component } from 'react';
import PrivateLayout from '../../../shared/PrivateLayout';
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
