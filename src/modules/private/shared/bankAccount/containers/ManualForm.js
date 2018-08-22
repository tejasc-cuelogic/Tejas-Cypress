import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';
import { validationActions } from '../../../../../services/actions';
import AddFunds from './AddFunds';

@inject('individualAccountStore', 'bankAccountStore', 'accountStore', 'uiStore', 'entityAccountStore', 'iraAccountStore')
@observer
export default class ManualForm extends Component {
  handleSubmitForm = (e) => {
    e.preventDefault();
    const { investmentAccType } = this.props.accountStore;
    const accTypeStore = investmentAccType === 'individual' ? 'individualAccountStore' : investmentAccType === 'entity' ? 'entityAccountStore' : investmentAccType === 'ira' ? 'iraAccountStore' : 'individualAccountStore';
    const currentStep = investmentAccType === 'entity' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 5 } : investmentAccType === 'ira' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 3 } : undefined;

    this.props[accTypeStore].createAccount(currentStep, 'draft').then(() => {
      if (investmentAccType === 'individual') {
        this.props[accTypeStore].setStepToBeRendered(1);
      } else {
        this.props.bankAccountStore.setShowAddFunds();
      }
    })
      .catch(() => { });
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
        <Header as="h3" textAlign="center">Link bank manually</Header>
        <p className="center-align">Enter your bank`s routing number and your checking account number.</p>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Form error onSubmit={this.handleSubmitForm}>
          <div className="field-wrap">
            <MaskedInput
              name="routingNumber"
              fielddata={formLinkBankManually.fields.routingNumber}
              changed={linkBankManuallyChange}
              routingNumber
            />
            <MaskedInput
              name="accountNumber"
              fielddata={formLinkBankManually.fields.accountNumber}
              changed={linkBankManuallyChange}
              accountNumber
            />
          </div>
          <div className="center-align">
            <Button.Group vertical>
              <Button primary size="large" className="relaxed" disabled={!formLinkBankManually.meta.isValid}>Confirm</Button>
              <Button type="button" className="link-button cancel-link" onClick={() => this.props.bankAccountStore.setBankLinkInterface('list')}>Or select your bank from the list</Button>
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}
