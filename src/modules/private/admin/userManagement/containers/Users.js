import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { USER_LIST_META } from '../../../../../constants/user';
import PrivateLayout from '../../../shared/PrivateLayout';
import { P1, P3, P5 } from '../components/UserListingSubheader';
import UserListing from '../components/manage/UserListing';

@inject('userListingStore', 'userStore', 'portfolioStore', 'transactionStore')
@observer
class Users extends Component {
  constructor(props) {
    super(props);
    this.props.userListingStore.initRequest();
    this.props.portfolioStore.setFieldValue('apiCall', false);
    this.props.transactionStore.setFieldValue('apiCall', false);
  }

  componentWillUnmount() {
    this.props.userListingStore.reset();
  }

  setSearchParam = (e, { name, value }, type) => this.props.userListingStore.setInitiateSrch(name, value, type);

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

  searchOnChange = (e) => {
    if (e.target.value === '') {
      this.props.userListingStore.setInitiateSrch('keyword', e.target.value);
    } else {
      this.props.userListingStore.searchOnChange('keyword', e.target.value);
    }
  }

  paginate = params => this.props.userListingStore.initRequest(params);

  render() {
    const {
      users, loading, error, usersSummary, requestState, filters, maskChange, count,
    } = this.props.userListingStore;
    const access = this.props.userStore.myAccessForModule('USERS');
    const isManager = access.asManager;
    return (
      <PrivateLayout
        {...this.props}
        P1={(
<P1
  executeSearch={this.executeSearch}
  change={this.searchOnChange}
  requestState={requestState}
  filters={filters}
  toggleSearch={this.toggleSearch}
  addon={isManager ? <P3 /> : null}
/>
)}
        P2={(
<P5
  requestState={requestState}
  setSearchParam={this.setSearchParam}
  dateFilter={maskChange}
  summary={usersSummary}
  removeFilter={this.removeFilter}
  filters={filters}
/>
)}
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
          isManager={isManager}
        />
      </PrivateLayout>
    );
  }
}

export default Users;
