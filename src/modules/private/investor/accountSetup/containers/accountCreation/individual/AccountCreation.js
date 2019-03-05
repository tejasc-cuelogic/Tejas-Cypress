import React from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';

import { MultiStep } from '../../../../../../../helper';
import { Plaid, AddFunds } from '../../../../../shared/bankAccount';
import Summary from './Summary';

@inject('uiStore', 'accountStore', 'bankAccountStore', 'individualAccountStore', 'userStore', 'userDetailsStore')
@observer
export default class AccountCreation extends React.Component {
  componentWillMount() {
    this.props.userDetailsStore.setUserAccDetails('individual');
    this.props.accountStore.setAccTypeChange(0);
  }
  handleMultiStepModalclose = () => {
    this.props.history.push('/app/summary');
    this.props.bankAccountStore.setBankLinkInterface('list');
    this.props.bankAccountStore.resetLinkBank();
    this.props.uiStore.setProgress(false);
    this.props.uiStore.setErrors(null);
  }
  handleStepChange = (step) => {
    this.props.individualAccountStore.setStepToBeRendered(step);
    this.props.uiStore.clearErrors();
  }
  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }

  render() {
    const {
      inProgress,
      isEnterPressed,
      setIsEnterPressed,
      resetIsEnterPressed,
    } = this.props.uiStore;
    // Done changes for saving link bank details - Alan's feedback point
    // const { plaidAccDetails, formLinkBankManually, formAddFunds } = this.props.bankAccountStore;
    const {
      formAddFunds,
      validateAddFunds,
      plaidAccDetails,
      formLinkBankManually,
      depositMoneyNow,
      showAddFunds,
      disableNextBtnPlaid,
    } = this.props.bankAccountStore;
    const { stepToBeRendered, createAccount } = this.props.individualAccountStore;
    const steps =
    [
      {
        name: 'Link Bank',
        component: <Plaid />,
        // isValid: (!isEmpty(plaidAccDetails) || formLinkBankManually.meta.isValid) ? '' : 'error',
        isDirty: !isEmpty(plaidAccDetails) ||
        formLinkBankManually.meta.isDirty,
        stepToBeRendered: 1,
        disableNextButton: disableNextBtnPlaid,
      },
      {
        name: 'Add funds',
        component: <AddFunds />,
        // isValid: formAddFunds.meta.isFieldValid ? '' : 'error',
        // Done changes for saving link bank details - Alan's feedback point
        // isValid: formAddFunds.meta.isValid || !depositMoneyNow ? ''
        // : stepToBeRendered > 1 ? 'error' : '',
        validate: validateAddFunds,
        isDirty: (!isEmpty(plaidAccDetails) &&
        formLinkBankManually.meta.isDirty &&
        formAddFunds.meta.isDirty) ||
        showAddFunds,
        disableNextButton: disableNextBtnPlaid,
        stepToBeRendered: 2,
      },
      {
        name: 'Summary',
        component: <Summary />,
        isValid: formAddFunds.meta.isValid || !depositMoneyNow ? '' : stepToBeRendered > 2 ? 'error' : '',
      },
    ];
    return (
      <div className="step-progress" >
        <MultiStep page setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} formTitle="Individual account creation" steps={steps} createAccount={createAccount} handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
