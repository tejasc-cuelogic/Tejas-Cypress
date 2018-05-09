import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button } from 'semantic-ui-react';
import FormInput from '../../../../components/form/FormInput';

@inject('individualAccountStore')
@observer
export default class LinkBankForm extends Component {
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.individualAccountStore.createAccount();
  }
  render() {
    const { formLinkBankManually, linkBankManuallyChange } = this.props.individualAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">We need this information to lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        <Form error onSubmit={this.handleSubmitForm}>
          <div className="field-wrap">
            {
              ['bankRoutingNumber', 'bankAccountNumber'].map(field => (
                <FormInput
                  key={field}
                  name={field}
                  fielddata={formLinkBankManually.fields[field]}
                  changed={linkBankManuallyChange}
                />
            ))}
          </div>
          <div className="center-align">
            <Button primary size="large" disabled={!formLinkBankManually.meta.isValid}>Confirm</Button>
          </div>
          <div className="center-align">
            <Button className="theme-link" onClick={() => this.props.individualAccountStore.setBankLinkInterface('list')}>Or select your bank from the list</Button>
          </div>
        </Form>
      </div>
    );
  }
}
