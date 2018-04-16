import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import validationActions from '../../../../actions/validation';
import FormRadioInput from '../../../../components/form/FormRadioInput';
import DatePicker from '../../../../components/form/DatePicker';

@inject('accountStore')
@observer
export default class AccountType extends Component {
  handleChange = (e, { name, value }) => {
    this.props.accountStore.setEntityAccountDetails(name, value);
  }
  handleDateChange = (date) => {
    validationActions.validateEntityAccountField('dateOfTrust', date);
  }
  render() {
    const { entityAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Is entity a trust?</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Header>
        <Form error>
          <Form.Group inline className="button-radio center-align">
            <FormRadioInput
              label="Yes"
              name={entityAccount.isEntityTrust.key}
              value="yes"
              checked={entityAccount.isEntityTrust.value === 'yes'}
              changed={this.handleChange}
            />
            <FormRadioInput
              label="No"
              name={entityAccount.isEntityTrust.key}
              value="no"
              checked={entityAccount.isEntityTrust.value === 'no'}
              changed={this.handleChange}
            />
          </Form.Group>
          <div className="field-wrap">
            <DatePicker
              label={entityAccount.dateOfTrust.label}
              placeholderText={entityAccount.dateOfTrust.placeHolder}
              selected={entityAccount.dateOfTrust.value}
              changed={this.handleDateChange}
              isdisabled={entityAccount.isEntityTrust.value === 'no'}
            />
          </div>
        </Form>
      </div>
    );
  }
}
