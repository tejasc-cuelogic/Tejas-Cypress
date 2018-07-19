import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { FormInput } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';
// import { validationActions } from '../../../../../services/actions';
import AddFunds from './AddFunds';

@inject('individualAccountStore', 'bankAccountStore', 'accountStore', 'uiStore', 'entityAccountStore')
@observer
export default class ManualForm extends Component {
  handleSubmitForm = (e) => {
    e.preventDefault();
    if (this.props.accountStore.investmentAccType === 'individual') {
      this.props.individualAccountStore.createAccount().then(() => {
        this.props.individualAccountStore.setStepToBeRendered(1);
      });
    } else {
      // const currentStep = {
      //   name: 'Link bank',
      //   validate: validationActions.validateLinkBankForm,
      // };
      // this.props.entityAccountStore.createAccount(currentStep);
      this.props.bankAccountStore.setShowAddFunds();
    }
  }

  render() {
    const { errors } = this.props.uiStore;
    const {
      showAddFunds,
      formLinkBankManually,
      linkBankManuallyChange,
    }
      = this.props.bankAccountStore;
    if (showAddFunds) {
      return <AddFunds />;
    }
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
            <FormInput
              name="routingNumber"
              fielddata={formLinkBankManually.fields.routingNumber}
              changed={linkBankManuallyChange}
            />
            <FormInput
              name="accountNumber"
              fielddata={formLinkBankManually.fields.accountNumber}
              changed={linkBankManuallyChange}
            />
          </div>
          <div className="center-align">
            <Button primary size="large" disabled={!formLinkBankManually.meta.isValid}>Confirm</Button>
          </div>
          <div className="center-align">
            <Button type="button" className="theme-link" onClick={() => this.props.bankAccountStore.setBankLinkInterface('list')}>Or select your bank from the list</Button>
          </div>
        </Form>
      </div>
    );
  }
}
