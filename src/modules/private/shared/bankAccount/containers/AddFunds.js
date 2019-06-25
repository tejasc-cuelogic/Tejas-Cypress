import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import Aux from 'react-aux';
import { MaskedInput } from '../../../../../theme/form';
import AccCreationHelper from '../../../investor/accountSetup/containers/accountCreation/helper';
import { ListErrors } from '../../../../../theme/shared';
import { validationActions } from '../../../../../services/actions';
import Helper from '../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
@inject('bankAccountStore', 'individualAccountStore', 'entityAccountStore', 'accountStore', 'iraAccountStore', 'uiStore')
@observer
export default class AddFunds extends Component {
  componentWillMount() {
    this.props.bankAccountStore.setDepositMoneyNow(true);
  }

  componentDidMount() {
    // this.props.bankAccountStore.validateForm('formAddFunds');
  }

  componentWillUnmount() {
    this.props.bankAccountStore.resetShowAddFunds();
  }

  doNotDepositMoneyNow = () => {
    this.props.bankAccountStore.validateAddFunds();
    this.props.bankAccountStore.setDepositMoneyNow(false);
    this.renderStep();
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.bankAccountStore.setDepositMoneyNow(true);
    this.props.bankAccountStore.setShouldValidateAmount(true);
    this.renderStep();
  }


  isValidFund = fundObj => !fundObj.meta.isValid || fundObj.fields.value.value === '';

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
      addFundChange,
      isAccountPresent,
      addFundsByAccType,
    } = this.props.bankAccountStore;
    const { errors } = this.props.uiStore;
    const isInValid = this.isValidFund(addFundsByAccType);
    return (
      <Aux>
        <div className={isMobile ? '' : 'center-align'}>
          <Header as="h4">How much would you like to deposit?</Header>
          <p>
            We
          {"'"}
          ll transfer funds directly from the bank account you just linked.
          </p>
          <Form error onSubmit={this.handleSubmitForm}>
            <div className={`${isMobile ? '' : 'field-wrap'} left-align`}>
              <MaskedInput
                name="value"
                type="tel"
                currency
                placeholder="$ 5,000"
                fielddata={addFundsByAccType.fields.value}
                changed={values => addFundChange(values, 'value')}
                maxLength={addFundsByAccType.maxLength}
                prefix="$ "
                showerror
                allowNegative={false}
              />
            </div>
            {errors
              && (
              <Message error className="mb-30">
                <ListErrors errors={[errors.message]} />
              </Message>
              )
            }
            <Button primary size="large" fluid={isMobile} className={`${isMobile ? 'mt-30' : ''} relaxed`} content="Confirm" disabled={isInValid || !isAccountPresent} />
          </Form>
          {!Helper.matchRegexWithUrl([/\bentity(?![-])\b/])
            && (
<div className="center-align">
                <Button color="green" className="link-button mt-30" disabled={!isAccountPresent} content="I don’t want to deposit any money now" onClick={() => this.doNotDepositMoneyNow()} />
              </div>
            )}
        </div>
      </Aux>
    );
  }
}
