import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import PrivateLayout from '../../shared/PrivateLayout';
import AllAccreditationRequests from './components/AllAccreditationRequests';
import { ByKeyword } from '../../../../theme/form/Filters';
import Filters from './components/Filters';

@inject('accreditationStore')
@observer
export default class CrowdPay extends Component {
  componentWillMount() {
    this.props.accreditationStore.initRequest();
  }
  setSearchParam = (e, { name, value }) =>
    this.props.accreditationStore.setInitiateSrch(name, value);
  toggleSearch = () => this.props.accreditationStore.toggleSearch();
  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.accreditationStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  change = (date, field) => {
    if (date && moment(date.formattedValue, 'MM-DD-YYYY', true).isValid()) {
      this.props.accreditationStore.setInitiateSrch(field, date);
    }
  }
  render() {
    const {
      requestState, filters, FILTER_FRM,
    } = this.props.accreditationStore;
    return (
      <PrivateLayout
        {...this.props}
        P1={
          <ByKeyword
            executeSearch={this.executeSearch}
            w={[8]}
            placeholder="Search by Investor or CrowdPay #"
            toggleSearch={this.toggleSearch}
            requestState={requestState}
            filters={filters}
          />
        }
        P2={
          <Filters
            requestState={requestState}
            filters={filters}
            setSearchParam={this.setSearchParam}
            executeSearch={this.executeSearch}
            change={this.change}
            FILTER_FRM={FILTER_FRM}
          />
        }
      >
        <AllAccreditationRequests {...this.props} />
      </PrivateLayout>
    );
  }
}
