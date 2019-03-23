import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import Aux from 'react-aux';
import { MaskedInput } from '../../../../../theme/form';
import AccCreationHelper from '../../../investor/accountSetup/containers/accountCreation/helper';
import { ListErrors } from '../../../../../theme/shared';
import { validationActions } from '../../../../../services/actions';

@inject('bankAccountStore', 'individualAccountStore', 'entityAccountStore', 'accountStore', 'iraAccountStore', 'uiStore')
@observer
export default class AddFunds extends Component {
  componentWillMount() {
    this.props.bankAccountStore.validateAddfundsAmount(this.props.accountStore.investmentAccType);
  }
  componentDidMount() {
    // this.props.bankAccountStore.validateForm('formAddFunds');
  }
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
    this.props.bankAccountStore.setShouldValidateAmount(true);
    this.renderStep();
  }

  renderStep = () => {
    if (this.props.accountStore.investmentAccType === 'individual') {
      const individualSteps = AccCreationHelper.individualSteps();
      const currentStep = {
        name: 'Add funds',
        stepToBeRendered: 2,
      };
      this.props.individualAccountStore.createAccount(currentStep).then(() => {
        this.props.bankAccountStore.setIsManualLinkBankSubmitted(false);
        this.props.individualAccountStore.setStepToBeRendered(individualSteps.summary);
      });
    }
    if (this.props.accountStore.investmentAccType === 'entity') {
      const currentStep = {
        name: 'Link bank',
        stepToBeRendered: 6,
        validate: validationActions.validateLinkBankForm,
      };
      this.props.entityAccountStore.createAccount(currentStep).then(() => {
        this.props.bankAccountStore.resetShowAddFunds();
        this.props.bankAccountStore.setIsManualLinkBankSubmitted(false);
        this.props.entityAccountStore.setStepToBeRendered(currentStep.stepToBeRendered);
      });
    }
    if (this.props.accountStore.investmentAccType === 'ira') {
      const currentStep = {
        name: 'Link bank',
        validate: validationActions.validateLinkBankForm,
        stepToBeRendered: 4,
      };
      this.props.iraAccountStore.createAccount(currentStep).then(() => {
        // this.props.bankAccountStore.resetAddFundsForm();
        this.props.bankAccountStore.resetShowAddFunds();
        this.props.bankAccountStore.setIsManualLinkBankSubmitted(false);
        this.props.iraAccountStore.setStepToBeRendered(currentStep.stepToBeRendered);
      });
    }
  }

  render() {
    const {
      formAddFunds,
      addFundChange,
      formEntityAddFunds,
    } = this.props.bankAccountStore;
    const { errors } = this.props.uiStore;
    const isValid = this.props.accountStore.investmentAccType === 'entity' ? (!formEntityAddFunds.meta.isValid || !formEntityAddFunds.fields.value.value) : (!formAddFunds.meta.isValid || !formAddFunds.fields.value.value);
    return (
      <Aux>
        <div className="center-align">
          <Header as="h3">Add funds</Header>
          <p>How much would you like to deposit into your account today?</p>
          <Form error onSubmit={this.handleSubmitForm}>
            <div className="field-wrap left-align">
              <MaskedInput
                name="value"
                type="tel"
                currency
                placeholder="$ 15,000"
                fielddata={this.props.accountStore.investmentAccType === 'entity' ? formEntityAddFunds.fields.value : formAddFunds.fields.value}
                changed={values => addFundChange(values, 'value', this.props.accountStore.investmentAccType)}
                maxLength={formAddFunds.fields.value.maxLength}
                prefix="$ "
                showerror
                allowNegative={false}
              />
            </div>
            {errors &&
              <Message error className="mb-30">
                <ListErrors errors={[errors.message]} />
              </Message>
            }
            <Button primary size="large" className="relaxed" content="Confirm" disabled={isValid} />
          </Form>
          {this.props.accountStore.investmentAccType !== 'entity' ?
            <Button color="green" className="link-button mt-30" content="I don’t want to deposit any money now" onClick={() => this.doNotDepositMoneyNow()} />
            : ''
          }
        </div>
      </Aux>
    );
  }
}
