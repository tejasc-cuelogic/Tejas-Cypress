import React from 'react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from '../../../../../../../helper';
import { Plaid, AddFunds } from '../../../../../shared/bankAccount';
import Summary from './Summary';
import GsModal from '../../../components/GsProcessingModal';

@inject('uiStore', 'accountStore', 'bankAccountStore', 'individualAccountStore', 'userStore', 'userDetailsStore')
@observer
export default class AccountCreation extends React.Component {
  componentWillMount() {
    if (!this.props.individualAccountStore.isFormSubmitted) {
      this.props.uiStore.setProgress();
      this.props.userDetailsStore.setUserAccDetails('individual');
      this.props.accountStore.setAccTypeChange(0);
    }
  }
  handleMultiStepModalclose = () => {
    this.updateUser();
    this.props.history.push('/app/summary');
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
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  closeProcessingModal = () => {
    this.props.individualAccountStore.setFieldValue('showProcessingModal', false);
    this.props.history.push('app/summary');
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
      depositMoneyNow,
      isPlaidDirty,
      linkbankSummary,
    } = this.props.bankAccountStore;
    const {
      stepToBeRendered, createAccount, showProcessingModal,
    } = this.props.individualAccountStore;
    const steps =
    [
      {
        name: 'Link Bank',
        component: <Plaid />,
        // isValid: (!isEmpty(plaidAccDetails) || formLinkBankManually.meta.isValid) ? '' : 'error',
        isDirty: isPlaidDirty,
        stepToBeRendered: 1,
        disableNextButton: !linkbankSummary,
      },
      {
        name: 'Add funds',
        component: <AddFunds />,
        // isValid: formAddFunds.meta.isFieldValid ? '' : 'error',
        // Done changes for saving link bank details - Alan's feedback point
        // isValid: formAddFunds.meta.isValid || !depositMoneyNow ? ''
        // : stepToBeRendered > 1 ? 'error' : '',
        validate: validateAddFunds,
        isDirty: isPlaidDirty,
        disableNextButton: true,
        stepToBeRendered: 2,
      },
      {
        name: 'Summary',
        component: <Summary />,
        disableNextButton: true,
        isValid: formAddFunds.meta.isValid || !depositMoneyNow ? '' : stepToBeRendered > 2 ? 'error' : '',
      },
    ];
    if (showProcessingModal) {
      return <GsModal open={showProcessingModal} closeModal={this.closeProcessingModal} />;
    }
    return (
      <div className="step-progress" >
        <MultiStep page disablePrevBtn setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} formTitle="Individual account creation" steps={steps} createAccount={createAccount} handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
