import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form/FormElements';
import Helper from '../../../../helper/utility';
import ListErrors from '../../../../theme/common/ListErrors';

@inject('individualAccountStore', 'uiStore')
@observer
export default class LinkBankForm extends Component {
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.individualAccountStore.createAccount().then(() => {
      Helper.toast('Account has been created.', 'success');
    })
      .catch(() => {
        console.log('in catch');
      });
  }

  render() {
    const { errors } = this.props.uiStore;
    const { formLinkBankManually, linkBankManuallyChange } = this.props.individualAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">We need this information to lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
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
