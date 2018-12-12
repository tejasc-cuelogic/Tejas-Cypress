import React, { Component } from 'react';
import moment from 'moment';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { FormRadioGroup, FormDatePicker } from '../../../../../../../theme/form';

@inject('entityAccountStore')
@observer
export default class AccountType extends Component {
  render() {
    const { TRUST_INFO_FRM, trustInfoChange, entityInfoDateChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Is Entity a trust?</Header>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={TRUST_INFO_FRM.fields.isTrust}
            name="isTrust"
            changed={trustInfoChange}
            containerclassname="button-radio center-align"
          />
          <div className="field-wrap">
            <FormDatePicker
              name="trustDate"
              placeholder="Select date"
              fielddata={TRUST_INFO_FRM.fields.trustDate}
              selected={moment(TRUST_INFO_FRM.fields.trustDate.value)}
              changed={date => entityInfoDateChange(date)}
              isdisabled={!TRUST_INFO_FRM.fields.isTrust.value}
            />
          </div>
        </Form>
      </div>
    );
  }
}
