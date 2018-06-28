import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { USER_LIST_META } from '../../../../constants/user';
import PrivateLayout from '../../../../containers/common/PrivateHOC';

import { P1, P2, P3, P5 } from './../components/UserListingSubheader';
import UserListing from '../components/manage/UserListing';

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
      users, loading, error, usersSummary, requestState,
    } = this.props.userListingStore;
    return (
      <PrivateLayout
        {...this.props}
        P1={<P1 executeSearch={this.executeSearch} />}
        P2={<P2 requestState={requestState} toggleSearch={this.toggleSearch} />}
        P3={<P3 />}
        P5={<P5
          requestState={requestState}
          setSearchParam={this.setSearchParam}
          dateFilterStart={this.dateFilterStart}
          dateFilterEnd={this.dateFilterEnd}
          summary={usersSummary}
          removeFilter={this.removeFilter}
        />}
      >
        <UserListing
          loading={loading}
          error={error}
          header={USER_LIST_META}
          listData={users}
          sortHandler={this.sortHandler}
          loadMore={this.loadMore}
          sortState={this.props.userListingStore.sortInfo}
        />
      </PrivateLayout>
    );
  }
}

export default Users;
