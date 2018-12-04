import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../shared/PrivateLayout';
import AllRequests from './components/AllRequests';
import { ByKeyword } from '../../../../theme/form/Filters';

@inject('bankAccountStore')
@observer
export default class CrowdPay extends Component {
  componentWillMount() {
    this.props.bankAccountStore.initRequest();
  }
  setSearchParam = (e, { name, value }) =>
    this.props.bankAccountStore.setInitiateSrch(name, value);
  toggleSearch = () => this.props.bankAccountStore.toggleSearch();
  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.bankAccountStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  dateFilterStart = (date) => {
    if (date) {
      this.props.bankAccountStore.setInitiateSrch('startDate', date);
    }
  }

  dateFilterEnd = (date) => {
    if (date) {
      this.props.bankAccountStore.setInitiateSrch('endDate', date);
    }
  }
  render() {
    // match
    const {
      requestState,
    } = this.props.bankAccountStore;
    return (
      <PrivateLayout
        {...this.props}
        P1={
          <ByKeyword
            executeSearch={this.executeSearch}
            w={[8]}
            placeholder="Search by Investor"
            toggleSearch={this.toggleSearch}
            requestState={requestState}
            more="no"
          />
        }
      >
        <AllRequests {...this.props} />
      </PrivateLayout>
    );
  }
}
