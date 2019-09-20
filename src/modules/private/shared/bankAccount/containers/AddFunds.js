import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';
import { validationActions } from '../../../../../services/actions';
import Helper from '../../../../../helper/utility';

@inject('bankAccountStore', 'individualAccountStore', 'entityAccountStore', 'accountStore', 'iraAccountStore', 'uiStore')
@observer
export default class AddFunds extends Component {
  constructor(props) {
    super(props);
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
      const currentStep = {
        name: 'Add funds',
        stepToBeRendered: 2,
        linkBankStepValue: 0,
      };
      this.props.individualAccountStore.createAccount(currentStep).then(() => {
        this.props.bankAccountStore.setIsManualLinkBankSubmitted(false);
        this.props.individualAccountStore.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
      }).catch(() => {
        this.props.individualAccountStore.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
      });
    }
    if (this.props.accountStore.investmentAccType === 'entity') {
      const currentStep = {
        name: 'Link bank',
        stepToBeRendered: 6,
        validate: validationActions.validateLinkBankForm,
        linkBankStepValue: 5,
      };
      this.props.entityAccountStore.createAccount(currentStep).then(() => {
        this.props.bankAccountStore.resetShowAddFunds();
        this.props.bankAccountStore.setIsManualLinkBankSubmitted(false);
        this.props.entityAccountStore.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
      }).catch(() => {
        this.props.entityAccountStore.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
      });
    }
    if (this.props.accountStore.investmentAccType === 'ira') {
      const currentStep = {
        name: 'Link bank',
        validate: validationActions.validateLinkBankForm,
        stepToBeRendered: 4,
        linkBankStepValue: 3,
      };
      this.props.iraAccountStore.createAccount(currentStep).then(() => {
        // this.props.bankAccountStore.resetAddFundsForm();
        this.props.bankAccountStore.resetShowAddFunds();
        this.props.bankAccountStore.setIsManualLinkBankSubmitted(false);
        this.props.iraAccountStore.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
      }).catch(() => {
        this.props.iraAccountStore.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
      });
    }
  }


  render() {
    const {
      addFundChange,
      isAccountPresent,
      addFundsByAccType,
    } = this.props.bankAccountStore;
    const { errors, inProgress } = this.props.uiStore;
    const isInValid = this.isValidFund(addFundsByAccType);
    return (
      <>
        <div className="center-align">
          <Header as="h3">Add funds</Header>
          <p>How much would you like to deposit into your account today?</p>
          <Form error onSubmit={this.handleSubmitForm}>
            <div className="field-wrap left-align">
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
            <Button primary size="large" className="relaxed" content="Confirm" disabled={isInValid || !isAccountPresent || inProgress} />
          </Form>
          {!Helper.matchRegexWithUrl([/\bentity(?![-])\b/])
            && <Button color="green" className="link-button mt-30" disabled={!isAccountPresent || inProgress} content="I don’t want to deposit any money now" onClick={() => this.doNotDepositMoneyNow()} />
          }
        </div>
      </>
    );
  }
}
