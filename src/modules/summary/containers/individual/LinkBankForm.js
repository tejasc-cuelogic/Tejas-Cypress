import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form/FormElements';
import Helper from '../../../../helper/utility';
import ListErrors from '../../../../theme/common/ListErrors';

@inject('individualAccountStore', 'accountStore', 'uiStore')
@observer
export default class LinkBankForm extends Component {
  handleSubmitForm = (e) => {
    e.preventDefault();
    if (this.props.accountStore.accountType.type === 'individual') {
      this.props.individualAccountStore.createAccount().then(() => {
        Helper.toast('Bank account has been linked.', 'success');
        this.props.individualAccountStore.setStepToBeRendered(1);
      });
    }
  }

  render() {
    const { errors } = this.props.uiStore;
    const { formLinkBankManually, linkBankManuallyChange } = this.props.accountStore;
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
              ['routingNumber', 'accountNumber'].map(field => (
                <FormInput
                  key={field}
                  name={field}
                  fielddata={formLinkBankManually.fields[field]}
                  changed={linkBankManuallyChange}
                  maxLength={formLinkBankManually.fields[field].maxLength}
                />
              ))
            }
          </div>
          <div className="center-align">
            <Button primary size="large" disabled={!formLinkBankManually.meta.isValid}>Confirm</Button>
          </div>
          <div className="center-align">
            <Button className="theme-link" onClick={() => this.props.accountStore.setBankLinkInterface('list')}>Or select your bank from the list</Button>
          </div>
        </Form>
      </div>
    );
  }
}
