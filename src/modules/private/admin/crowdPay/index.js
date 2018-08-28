import React, { Component } from 'react';
<<<<<<< HEAD
import { Route, Switch } from 'react-router-dom';
import { Grid, Form } from 'semantic-ui-react';
import PrivateLayout from '../../shared/PrivateLayout';
import ManageCrowdPay from './containers/ManageCrowdPay';
import { ByKeyword, DropdownFilter, DateRangeFilter } from '../../../../theme/form/Filters';
=======
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { mapValues } from 'lodash';
import { Label } from 'semantic-ui-react';
import PrivateLayout from '../../shared/PrivateLayout';
import AllCrowdPay from './components/AllCrowdPay';
import { ByKeyword } from '../../../../theme/form/Filters';
import Filters from './components/Filters';
>>>>>>> develop

@inject('crowdpayStore')
@observer
export default class CrowdPay extends Component {
  setSearchParam = (e, { name, value }) => this.props.crowdpayStore.setInitiateSrch(name, value);
  toggleSearch = () => this.props.crowdpayStore.toggleSearch();
  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.crowdpayStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  dateFilterStart = (date) => {
    if (date) {
      this.props.crowdpayStore.setInitiateSrch('startDate', date);
    }
  }

  dateFilterEnd = (date) => {
    if (date) {
      this.props.crowdpayStore.setInitiateSrch('endDate', date);
    }
  }
  representAddon = summary => mapValues(summary, s => (
    <Label circular color="red" size="mini">{s}</Label>
  ));

  render() {
    const { match, crowdpayStore } = this.props;
    const {
      requestState, filters, FILTER_FRM, fChange, summary,
    } = crowdpayStore;
    return (
      <PrivateLayout
        {...this.props}
        subNav
        subNavAddon={{ data: this.representAddon(summary) }}
        P1={
          <ByKeyword
            executeSearch={this.executeSearch}
            w={[8]}
            placeholder="Search by Name or E-mail address"
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
            dateFilterStart={this.dateFilterStart}
            dateFilterEnd={this.dateFilterEnd}
            FILTER_FRM={FILTER_FRM}
            fChange={fChange}
          />
        }
      >
        <Route path={`${match.url}/:type?`} component={AllCrowdPay} />
      </PrivateLayout>
    );
  }
}
