import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { FormRadioGroup, FormDatePicker } from '../../../../theme/form/FormElements';

@inject('accountStore', 'entityAccountStore')
@observer
export default class AccountType extends Component {
  handleDateChange = (date) => {
    this.props.entityAccountStore.entityInfoDateChange(date);
  }
  render() {
    const { formEntityInfo, entityInfoChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Is entity a trust?</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Header>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={formEntityInfo.fields.isTrust}
            name="isTrust"
            changed={entityInfoChange}
            containerclassname="button-radio center-align"
          />
          <div className="field-wrap">
            <FormDatePicker
              name="trustDate"
              fielddata={formEntityInfo.fields.trustDate}
              selected={formEntityInfo.fields.trustDate.value}
              changed={this.handleDateChange}
              isdisabled={!formEntityInfo.fields.isTrust.value}
            />
          </div>
        </Form>
      </div>
    );
  }
}
