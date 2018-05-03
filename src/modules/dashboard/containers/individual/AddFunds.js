import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Input, Button } from 'semantic-ui-react';

import validationActions from '../../../../actions/validation';

@inject('accountStore')
@observer
export default class AddFunds extends Component {
  handleInputChange = (e, { name, value }) => {
    validationActions.validateIndividualAccountField(name, value);
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateLinkBankAccountForm();
  }
  render() {
    return (
      <div>
        <Header as="h1" textAlign="center">Add funds</Header>
        <Header as="h4" textAlign="center">How much would you like to deposit into your account today?</Header>
        <Form error onSubmit={this.handleSubmitForm}>
          <div className="field-wrap">
            <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for */ }
              <label>
                Value
              </label>
              <Input
                name="value"
              />
            </Form.Field>
          </div>
          <div className="center-align">
            <Button primary size="large">Confirm</Button>
          </div>
          <div className="center-align">
            <Button className="theme-link" onClick={() => this.props.accountStore.setBankLinkInterface('list')}>I dnt want to deposit any money now</Button>
          </div>
        </Form>
      </div>
    );
  }
}
