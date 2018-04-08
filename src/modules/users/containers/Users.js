import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { USER_LIST_META } from '../../../constants/user';
import UserListingSubheader from './../components/UserListingSubheader';
import UserListing from './../components/UserListing';

@inject('userListingStore')
@observer
class Users extends Component {
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
          header={USER_LIST_META}
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
