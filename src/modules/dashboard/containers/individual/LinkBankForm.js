import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Input, Button, Popup, Icon } from 'semantic-ui-react';

import FieldError from '../../../../components/common/FieldError';
import validationActions from '../../../../actions/validation';

@inject('accountStore')
@observer
export default class LinkBankForm extends Component {
  handleInputChange = (e, { name, value }) => {
    validationActions.validateIndividualAccountField(name, value);
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateLinkBankAccountForm();
  }
  render() {
    const { individualAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">We need this information to lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        <Form error onSubmit={this.handleSubmitForm}>
          <div className="field-wrap">
            <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for */ }
              <label>
                {individualAccount.bankRoutingNumber.label}
                <Popup
                  trigger={<Icon name="ns-help-circle outline" />}
                  content="Put your 10 digit bank routing number"
                  position="top center"
                  className="center-align"
                />
              </label>
              <Input
                name={individualAccount.bankRoutingNumber.key}
                value={individualAccount.bankRoutingNumber.value}
                error={!!individualAccount.bankRoutingNumber.error}
                onChange={this.handleInputChange}
                maxLength={10}
              />
              <FieldError error={individualAccount.bankRoutingNumber.error} />
            </Form.Field>
            <Form.Field>
              <label>
                {individualAccount.bankAccountNumber.label}
                <Popup
                  trigger={<Icon name="ns-help-circle outline" />}
                  content="Put your 12 digit bank account number"
                  position="top center"
                  className="center-align"
                />
              </label>
              <Input
                name={individualAccount.bankAccountNumber.key}
                value={individualAccount.bankAccountNumber.value}
                error={!!individualAccount.bankAccountNumber.error}
                onChange={this.handleInputChange}
                maxLength={12}
              />
              <FieldError error={individualAccount.bankAccountNumber.error} />
            </Form.Field>
          </div>
          <div className="center-align">
            <Button primary size="large">Confirm</Button>
          </div>
          <div className="center-align">
            <Button className="theme-link" onClick={() => this.props.accountStore.setBankLinkInterface('list')}>Or select your bank from the list</Button>
          </div>
        </Form>
      </div>
    );
  }
}
