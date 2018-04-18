import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import validationActions from '../../../../actions/validation';
import { FormRadioInput, DatePicker } from '../../../../components/form/FormElements';

@inject('accountStore', 'entityAccountStore')
@observer
export default class AccountType extends Component {
  handleDateChange = (date) => {
    validationActions.validateEntityAccountField('dateOfTrust', date);
  }
  render() {
    const { formEntityInfo, entityInfoChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Is entity a trust?</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Header>
        <Form error>
          <Form.Group inline className="button-radio center-align">
            <FormRadioInput
              name={formEntityInfo.fields.isEntityTrust.key}
              label="Yes"
              value="yes"
              checked={formEntityInfo.fields.isEntityTrust.value === 'yes'}
              changed={entityInfoChange}
            />
            <FormRadioInput
              name={formEntityInfo.fields.isEntityTrust.key}
              label="No"
              value="no"
              checked={formEntityInfo.fields.isEntityTrust.value === 'no'}
              changed={entityInfoChange}
            />
          </Form.Group>
          <div className="field-wrap">
            <DatePicker
              label={formEntityInfo.fields.dateOfTrust.label}
              placeholderText={formEntityInfo.fields.dateOfTrust.placeHolder}
              selected={formEntityInfo.fields.dateOfTrust.value}
              changed={this.handleDateChange}
              isdisabled={formEntityInfo.fields.isEntityTrust.value === 'no'}
            />
          </div>
        </Form>
      </div>
    );
  }
}
