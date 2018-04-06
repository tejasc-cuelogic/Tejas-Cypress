import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import UserListingSubheader from './../components/UserListingSubheader';
import UserListing from './../components/UserListing';

@inject('userListingStore')
@observer
class Users extends Component {
  headerMeta = [
    ['profilepic', '', false],
    ['full_name', 'Full Name', true],
    ['residence_city', 'Residence City', true],
    ['phone', 'Phone', true],
    ['type', 'Type', true],
    ['last_login', 'Last Login', true],
    ['account_creation', 'Account Creation', true],
    ['actions', '', false],
  ];
  render() {
    const {
      users, loading, error, usersSummary,
    } = this.props.userListingStore;
    return (
      <Aux>
        <UserListingSubheader summary={usersSummary} />
        <UserListing
          loading={loading}
          error={error}
          header={this.headerMeta}
          listData={users}
        />
      </Aux>
    );
  }
}

export default Users;
