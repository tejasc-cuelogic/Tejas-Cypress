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
    ['firstName', 'Full Name', true],
    ['residence_city', 'Residence City', false],
    ['phone', 'Phone', false],
    ['accountType', 'Type', true],
    ['lastLogin', 'Last Login', true],
    ['createdAt', 'Account Creation', true],
    ['actions', '', false],
  ];

  sortHandler = (by, sortable) => {
    this.props.userListingStore.initiateSort(by, sortable);
  };

  toggleSearch = () => this.props.userListingStore.toggleSearch();

  loadMore = () => this.props.userListingStore.loadMore();

  render() {
    const {
      users, loading, error, usersSummary,
    } = this.props.userListingStore;
    return (
      <Aux>
        <UserListingSubheader
          summary={usersSummary}
          currState={this.props.userListingStore.requestState}
          toggleSearch={this.toggleSearch}
        />
        <UserListing
          loading={loading}
          error={error}
          header={this.headerMeta}
          listData={users}
          sortHandler={this.sortHandler}
          loadMore={this.loadMore}
          sortState={this.props.userListingStore.sortInfo}
        />
      </Aux>
    );
  }
}

export default Users;
