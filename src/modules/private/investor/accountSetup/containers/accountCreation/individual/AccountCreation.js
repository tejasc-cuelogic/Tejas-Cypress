import React from 'react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from '../../../../../../../helper';
import { Plaid, AddFunds } from '../../../../../shared/bankAccount';
import Summary from './Summary';

@inject('uiStore', 'accountStore', 'bankAccountStore', 'individualAccountStore', 'userStore', 'userDetailsStore')
@observer
export default class AccountCreation extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.individualAccountStore.isFormSubmitted) {
      this.props.uiStore.setProgress();
      this.props.userDetailsStore.setUserAccDetails('individual');
      this.props.accountStore.setAccTypeChange(0);
    }
  }

  handleMultiStepModalclose = () => {
    this.updateUser();
    this.props.bankAccountStore.setBankLinkInterface('list');
    this.props.bankAccountStore.resetStoreData();
    this.props.uiStore.setProgress(false);
    this.props.uiStore.setErrors(null);
  }

  handleStepChange = (step) => {
    this.props.individualAccountStore.setStepToBeRendered(step);
    this.props.uiStore.clearErrors();
  }

  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub).then(() => {
      const { getInvestorAccountsRoute } = this.props.userDetailsStore;
      const route = getInvestorAccountsRoute('individual');
      if (route) {
        this.props.history.push(`/app/account-details/${route}/portfolio`);
      } else {
        this.props.history.push('/app/setup');
      }
    });
  }

  render() {
    const {
      inProgress,
      isEnterPressed,
      setIsEnterPressed,
      resetIsEnterPressed,
      createAccountMessage,
      inProgressArray,
    } = this.props.uiStore;
    // Done changes for saving link bank details - Alan's feedback point
    // const { plaidAccDetails, formLinkBankManually, formAddFunds } = this.props.bankAccountStore;
    const {
      formAddFunds,
      validateAddFunds,
      depositMoneyNow,
      isPlaidDirty,
      linkbankSummary,
      isAccountPresent, setLinkBankSummary,
    } = this.props.bankAccountStore;
    const {
      stepToBeRendered, createAccount,
    } = this.props.individualAccountStore;
    const steps = [
      {
        name: 'Link Bank',
        component: <Plaid />,
        // eslint-disable-next-line max-len
        // isValid: (!isEmpty(plaidAccDetails) || formLinkBankManually.meta.isValid) ? '' : 'error',
        isDirty: isPlaidDirty,
        stepToBeRendered: 1,
        disableNextButton: !linkbankSummary,
        validForm: isAccountPresent,
      },
      {
        name: 'Add funds',
        component: <AddFunds />,
        isValid: formAddFunds.meta.isValid ? '' : stepToBeRendered > 1 ? 'error' : '',
        // Done changes for saving link bank details - Alan's feedback point
        // isValid: formAddFunds.meta.isValid || !depositMoneyNow ? ''
        // : stepToBeRendered > 1 ? 'error' : '',
        validate: validateAddFunds,
        isDirty: isPlaidDirty,
        validForm: formAddFunds.meta.isValid,
        addFunds: true,
        disableNextButton: true,
        stepToBeRendered: 2,
      },
      {
        name: 'Summary',
        component: <Summary handleUserIdentity={this.props.handleUserIdentity} handleLegalDocsBeforeSubmit={this.props.handleLegalDocsBeforeSubmit} />,
        disableNextButton: true,
        isValid: formAddFunds.meta.isValid || !depositMoneyNow ? '' : stepToBeRendered > 2 ? 'error' : '',
      },
    ];
    return (
      <div className="step-progress">
        <MultiStep isAccountCreation loaderMsg={createAccountMessage} setLinkbankSummary={setLinkBankSummary} page disablePrevBtn setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress || inProgressArray.includes('submitAccountLoader')} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} formTitle="Individual account creation" steps={steps} createAccount={createAccount} handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
