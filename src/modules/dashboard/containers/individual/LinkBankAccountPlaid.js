import React from 'react';
import { inject, observer } from 'mobx-react';
import PlaidLink from 'react-plaid-link';
import { Header, Form, Input, Button, Popup, Icon } from 'semantic-ui-react';

import validationActions from '../../../../actions/validation';
import FieldError from '../../../../components/common/FieldError';

@inject('accountStore')
@observer
export default class LinkBankAccountPlaid extends React.Component {
  handleOnSuccess = (token, metadata) => {
    // send token to client server
    console.log(token, metadata);
  }
  handleInputChange = (e, { name, value }) => {
    validationActions.validateIndividualAccountField(name, value);
  }
  render() {
    const { individualAccount } = this.props.accountStore;
    return (
      <div>
        {this.props.accountStore.bankLinkInterface === 'list' &&
        <div>
          <Header as="h1" textAlign="center">Link Bank Account</Header>
          <Header as="h4" textAlign="center">Select your bank from the list</Header>
          <div className="row">
            <div className="six columns">
              <PlaidLink
                clientName="Plaid Client"
                env="sandbox"
                product={['auth']}
                publicKey="614be98f819e9bd8d0db9abec1c08a"
                apiVersion="v2"
                onSuccess={this.handleOnSuccess}
              >
                Open Plaid Link button
              </PlaidLink>
            </div>
          </div>
          <div className="center-align">
            <Button className="theme-link" color="green" onClick={() => this.props.accountStore.setBankLinkInterface('form')}>or enter it manually</Button>
          </div>
        </div>
        }
        {this.props.accountStore.bankLinkInterface === 'form' &&
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
                    trigger={<Icon name="help circle outline" />}
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
                    trigger={<Icon name="help circle outline" />}
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
              <Button color="green" size="large">Confirm</Button>
            </div>
            <div className="center-align">
              <Button className="theme-link" onClick={() => this.props.accountStore.setBankLinkInterface('list')}>Or select your bank from the list</Button>
            </div>
          </Form>
        </div>
        }
      </div>
    );
  }
}
