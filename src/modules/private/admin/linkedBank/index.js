import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import PrivateLayout from '../../shared/PrivateLayout';
import AllRequests from './components/AllRequests';
import { ByKeyword } from '../../../../theme/form/Filters';
import { FormCheckbox } from '../../../../theme/form';

@inject('bankAccountStore')
@observer
export default class CrowdPay extends Component {
  componentWillMount() {
    this.props.bankAccountStore.initRequest();
  }

  setSearchParam = (e, { name, value }) => this.props.bankAccountStore.setInitiateSrch(name, value);

  toggleSearch = () => this.props.bankAccountStore.toggleSearch();

  executeSearch = (e) => {
    this.props.bankAccountStore.setInitiateSrch('keyword', e.target.value);
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
      FILTER_FRM,
      fChange,
    } = this.props.bankAccountStore;
    return (
      <PrivateLayout
        {...this.props}
        P1={(
<Aux>
            <ByKeyword
              change={this.executeSearch}
              w={[8]}
              placeholder="Search by Investor"
              toggleSearch={this.toggleSearch}
              requestState={requestState}
              more="no"
            />
            <FormCheckbox
              fielddata={FILTER_FRM.fields.locked}
              name="locked"
              changed={fChange}
              defaults
              containerclassname="ui list horizontal"
            />
          </Aux>
)}
      >
        <AllRequests {...this.props} />
      </PrivateLayout>
    );
  }
}
