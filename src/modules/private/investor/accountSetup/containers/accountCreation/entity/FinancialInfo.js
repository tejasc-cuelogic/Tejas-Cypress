import React, { Component } from 'react';
import moment from 'moment';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { FormRadioGroup, FormDatePicker } from '../../../../../../../theme/form';

@inject('accountStore', 'entityAccountStore')
@observer
export default class AccountType extends Component {
  handleDateChange = (date) => {
    this.props.entityAccountStore.entityInfoDateChange(date);
  }
  render() {
    const { TRUST_INFO_FRM, entityInfoChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Is entity a trust?</Header>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={TRUST_INFO_FRM.fields.isTrust}
            name="isTrust"
            changed={entityInfoChange}
            containerclassname="button-radio center-align"
          />
          <div className="field-wrap">
            <FormDatePicker
              name="trustDate"
              fielddata={TRUST_INFO_FRM.fields.trustDate}
              selected={moment(TRUST_INFO_FRM.fields.trustDate.value)}
              changed={this.handleDateChange}
              isdisabled={!TRUST_INFO_FRM.fields.isTrust.value}
            />
          </div>
        </Form>
      </div>
    );
  }
}
