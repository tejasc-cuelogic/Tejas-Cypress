import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { USER_LIST_META } from '../../../../../constants/user';
import PrivateLayout from '../../../shared/PrivateLayout';
import { P1, P3, P5 } from './../components/UserListingSubheader';
import UserListing from '../components/manage/UserListing';

@inject('userListingStore')
@observer
class Users extends Component {
  componentWillMount() {
    this.props.userListingStore.initRequest();
  }

  setSearchParam = (e, { name, value }) => this.props.userListingStore.setInitiateSrch(name, value);

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
  paginate = params => this.props.userListingStore.initRequest(params);
  render() {
    const {
      users, loading, error, usersSummary, requestState, filters, maskChange, count,
    } = this.props.userListingStore;
    return (
      <PrivateLayout
        {...this.props}
        P1={<P1
          executeSearch={this.executeSearch}
          requestState={requestState}
          filters={filters}
          addon={<P3 />}
        />}
        P2={<P5
          requestState={requestState}
          setSearchParam={this.setSearchParam}
          dateFilter={maskChange}
          summary={usersSummary}
          removeFilter={this.removeFilter}
          filters={filters}
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
          paginate={this.paginate}
          count={count}
          requestState={requestState}
        />
      </PrivateLayout>
    );
  }
}

export default Users;
