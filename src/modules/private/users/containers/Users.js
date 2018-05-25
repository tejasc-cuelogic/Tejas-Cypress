import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { USER_LIST_META } from '../../../../constants/user';
import UserListingSubheader from './../components/UserListingSubheader';
import UserListing from './../components/UserListing';

@inject('userListingStore')
@observer
class Users extends Component {
  componentWillMount() {
    this.props.userListingStore.initRequest();
  }

  setSearchParam = (e, { name, value }) => this.props.userListingStore.setInitiateSrch(name, value);

  dateFilterStart = (date) => {
    if (date) {
      this.props.userListingStore.setInitiateSrch('startDate', date);
    }
  }

  dateFilterEnd = (date) => {
    if (date) {
      this.props.userListingStore.setInitiateSrch('endDate', date);
    }
  }

  toggleSearch = () => this.props.userListingStore.toggleSearch();

  loadMore = () => this.props.userListingStore.loadMore();

  removeFilter = name => this.props.userListingStore.removeFilter(name);

  sortHandler = (by, sortable) => {
    this.props.userListingStore.initiateSort(by, sortable);
  };

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.userListingStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  render() {
    const {
      users, loading, error, usersSummary,
    } = this.props.userListingStore;
    return (
      <Aux>
        <UserListingSubheader
          summary={usersSummary}
          filters={this.props.userListingStore.filters}
          requestState={this.props.userListingStore.requestState}
          toggleSearch={this.toggleSearch}
          executeSearch={this.executeSearch}
          setSearchParam={this.setSearchParam}
          dateFilterStart={this.dateFilterStart}
          dateFilterEnd={this.dateFilterEnd}
          removeFilter={this.removeFilter}
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
