import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { mapValues } from 'lodash';
// import moment from 'moment';
import { Label } from 'semantic-ui-react';
import PrivateLayout from '../../shared/PrivateLayout';
import AllCrowdPay from './components/AllCrowdPay';
import { InlineLoader } from './../../../../theme/shared';
import { ByKeyword } from '../../../../theme/form/Filters';
import Filters from './components/Filters';

@inject('crowdpayStore')
@observer
export default class CrowdPay extends Component {
  componentWillMount() {
    // if (!this.props.crowdpayStore.isApiHit) {
    // this.props.crowdpayStore.reset();
    // this.props.crowdpayStore.initRequest();
    // }
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/review`);
    }
  }
  setSearchParam = (e, { name, value }) => this.props.crowdpayStore.setInitiateSrch(name, value);
  toggleSearch = () => this.props.crowdpayStore.toggleSearch();
  executeSearch = (e) => {
    this.props.crowdpayStore.setInitiateSrch('keyword', e.target.value);
  }

  change = (date, field) => {
    // if (date && moment(date.formattedValue, 'MM-DD-YYYY', true).isValid()) {
    this.props.crowdpayStore.setInitiateSrch(field, date);
    // }
  }
  representAddon = summary => mapValues(summary, s => (
    <Label circular color="red" size="mini">{s}</Label>
  ));

  render() {
    const { match, crowdpayStore } = this.props;
    const {
      requestState, filters, FILTER_FRM, fChange, loading,
      // summary,
    } = crowdpayStore;
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <PrivateLayout
        {...this.props}
        subNav
        // subNavAddon={{ data: this.representAddon(summary) }}
        P1={
          <ByKeyword
            w={[8]}
            placeholder="Search by Name or E-mail address"
            toggleSearch={this.toggleSearch}
            requestState={requestState}
            filters={filters}
            change={this.executeSearch}
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
            fChange={fChange}
          />
        }
      >
        <Route path={`${match.url}/:type`} component={AllCrowdPay} />
      </PrivateLayout>
    );
  }
}
