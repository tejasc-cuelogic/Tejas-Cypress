import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';
import { validationActions } from '../../../../../services/actions';
import Helper from '../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
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
    this.props.bankAccountStore.resetAddFundsForm();
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
    const { ACC_TYPE_MAPPING, INVESTMENT_ACC_TYPES } = this.props.accountStore;
    const { store, name } = ACC_TYPE_MAPPING[INVESTMENT_ACC_TYPES.fields.accType.value];
    const currentStep = name === 'entity' ? {
      name: 'Add funds',
      stepToBeRendered: 7,
      validate: validationActions.validateLinkBankForm,
      linkBankStepValue: 6,
    } : name === 'ira' ? {
      name: 'Add funds',
      validate: validationActions.validateLinkBankForm,
      stepToBeRendered: 6,
      linkBankStepValue: 5,
    } : {
      name: 'Add funds',
      stepToBeRendered: 2,
      linkBankStepValue: 0,
    };
    store.createAccount(currentStep).then(() => {
      if (this.props.bankAccountStore.isAccountPresent) {
        this.props.bankAccountStore.setIsManualLinkBankSubmitted(false);
      }
      store.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
    }).catch(() => {
      store.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
    });
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
        <div className={isMobile ? '' : 'center-align'}>
          <Header as="h3">How much would you like to deposit?</Header>
          <p>
            We
          {"'"}
            ll transfer funds directly from the bank account you just linked.
          </p>
          <Form error onSubmit={this.handleSubmitForm}>
            <div className={`${isMobile ? 'mt-30' : 'field-wrap'} left-align`}>
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
              />
            </div>
            {errors
              && (
                <Message error className="mb-30">
                  <ListErrors errors={[errors.message]} />
                </Message>
              )
            }
            <Button primary size="large" fluid={isMobile} className={`${isMobile ? 'mt-30' : ''} relaxed`} content="Confirm" disabled={isInValid || !isAccountPresent || inProgress} />
          </Form>
          <div className="center-align">
            {!Helper.matchRegexWithUrl([/\bentity(?![-])\b/])
              && <Button color="green" className="link-button mt-30" disabled={!isAccountPresent || inProgress} content="I don’t want to deposit any money now" onClick={() => this.doNotDepositMoneyNow()} />
            }
          </div>
        </div>
      </>
    );
  }
}
