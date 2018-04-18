import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import validationActions from '../../../../actions/validation';

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
            <Form.Radio label="Yes" name={entityAccount.isEntityTrust.key} value="yes" checked={entityAccount.isEntityTrust.value === 'yes'} onChange={this.handleChange} />
            <Form.Radio label="No" name={entityAccount.isEntityTrust.key} value="no" checked={entityAccount.isEntityTrust.value === 'no'} onChange={this.handleChange} />
          </Form.Group>
          <div className="field-wrap">
            <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for */ }
              <label>
                {entityAccount.dateOfTrust.label}
              </label>
              <DatePicker
                showMonthDropdown
                showYearDropdown
                placeholderText={entityAccount.dateOfTrust.placeHolder}
                dateFormat="MM-DD-YYYY"
                maxDate={moment()}
                selected={entityAccount.dateOfTrust.value}
                onChange={this.handleDateChange}
                disabled={entityAccount.isEntityTrust.value === 'no'}
              />
            </Form.Field>
          </div>
        </Form>
      </div>
    );
  }
}
