import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';

import { MaskedInput } from '../../../../../theme/form';
import AccCreationHelper from '../../../investor/accountSetup/containers/accountCreation/helper';
import { ListErrors } from '../../../../../theme/shared';
import { validationActions } from '../../../../../services/actions';

@inject('bankAccountStore', 'individualAccountStore', 'entityAccountStore', 'accountStore', 'iraAccountStore', 'uiStore')
@observer
export default class AddFunds extends Component {
  // componentDidMount() {
  //   this.props.individualAccountStore.setStepToBeRendered(1);
  // }
  componentWillUnmount() {
    this.props.bankAccountStore.resetShowAddFunds();
  }
  doNotDepositMoneyNow = () => {
    this.props.bankAccountStore.setDepositMoneyNow(false);
    if (!this.props.bankAccountStore.formAddFunds.fields.value.error) {
      this.renderStep();
    }
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.bankAccountStore.setDepositMoneyNow(true);
    this.renderStep();
  }

  renderStep = () => {
    if (this.props.accountStore.investmentAccType === 'individual') {
      const individualSteps = AccCreationHelper.individualSteps();
      const currentStep = {
        name: 'Add funds',
        stepToBeRendered: 2,
      };
      if (this.props.bankAccountStore.formAddFunds.fields.value.value) {
        this.props.individualAccountStore.createAccount(currentStep);
      }
      this.props.individualAccountStore.setStepToBeRendered(individualSteps.summary);
    }
    if (this.props.accountStore.investmentAccType === 'entity') {
      const currentStep = {
        name: 'Link bank',
        stepToBeRendered: 6,
        validate: validationActions.validateLinkBankForm,
      };
      if (this.props.bankAccountStore.formAddFunds.fields.value.value) {
        this.props.entityAccountStore.createAccount(currentStep);
      }
      this.props.entityAccountStore.setStepToBeRendered(AccCreationHelper.entitySteps().summary);
    }
    if (this.props.accountStore.investmentAccType === 'ira') {
      const currentStep = {
        name: 'Link bank',
        validate: validationActions.validateLinkBankForm,
        stepToBeRendered: 4,
      };
      if (this.props.bankAccountStore.formAddFunds.fields.value.value) {
        this.props.iraAccountStore.createAccount(currentStep);
      }
      this.props.iraAccountStore.setStepToBeRendered(AccCreationHelper.iraSteps().summary);
    }
  }

  render() {
    const { formAddFunds, addFundChange } = this.props.bankAccountStore;
    const { errors } = this.props.uiStore;

    return (
      <div>
        <Header as="h3" textAlign="center">Add funds</Header>
        <p className="center-align">How much would you like to deposit into your account today?</p>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Form error onSubmit={this.handleSubmitForm}>
          <div className="field-wrap">
            <MaskedInput
              name="value"
              type="tel"
              currency
              placeholder="$ 15,000"
              fielddata={formAddFunds.fields.value}
              changed={values => addFundChange(values, 'value')}
              maxLength={formAddFunds.fields.value.maxLength}
              prefix="$ "
              showerror
            />
          </div>
          <div className="center-align">
            <Button primary size="large" className="relaxed" disabled={!formAddFunds.meta.isValid}>Confirm</Button>
          </div>
        </Form>
        <div className="center-align mt-20">
          <Button type="button" color="green" className="link-button" onClick={() => this.doNotDepositMoneyNow()}>I don’t want to deposit any money now</Button>
        </div>
      </div>
    );
  }
}
