import React from 'react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from '../../../../../../../helper';
import FinancialInformation from './FinancialInformation';
import AccountType from './AccountType';
import Funding from './Funding';
import Identity from './Identity';
import Summary from './Summary';
import { validationActions } from '../../../../../../../services/actions';
import { Plaid } from '../../../../../shared/bankAccount';
import GsModal from '../../../components/GsProcessingModal';

@inject('uiStore', 'accountStore', 'iraAccountStore', 'userDetailsStore', 'userStore', 'bankAccountStore')
@observer
export default class AccountCreation extends React.Component {
  componentWillMount() {
    if (!this.props.iraAccountStore.isFormSubmitted) {
      this.props.uiStore.setProgress();
      this.props.userDetailsStore.setUserAccDetails('ira');
      this.props.accountStore.setAccTypeChange(1);
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
    this.props.iraAccountStore.setStepToBeRendered(step);
    this.props.uiStore.clearErrors();
  }
  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  closeProcessingModal = () => {
    const { partialInvestNowSessionURL, setPartialInvestmenSession } = this.props.userDetailsStore;
    this.props.iraAccountStore.setFieldValue('showProcessingModal', false);
    if (partialInvestNowSessionURL) {
      this.props.history.push(partialInvestNowSessionURL);
      setPartialInvestmenSession();
    } else {
      this.props.history.push('/app/summary');
      this.props.uiStore.resetcreateAccountMessage();
    }
  }
  render() {
    let steps = [];
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
      createAccountMessage,
    } = this.props.uiStore;
    const {
      FIN_INFO_FRM, showProcessingModal,
      ACC_TYPES_FRM,
      FUNDING_FRM,
      IDENTITY_FRM,
      stepToBeRendered,
      createAccount,
      isValidIraForm,
    } = this.props.iraAccountStore;
    const {
      formIraAddFunds, isAccountPresent,
      formLinkBankManually, isPlaidDirty,
      linkbankSummary, bankSummarySubmit,
      stepbankSummary, showAddFunds,
      setLinkBankSummary,
    } = this.props.bankAccountStore;
    if (FUNDING_FRM.fields.fundingType.value === 0) {
      steps =
      [
        {
          name: 'Financial info',
          component: <FinancialInformation />,
          isValid: FIN_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 0 ? 'error' : FIN_INFO_FRM.meta.isDirty ? 'error' : '',
          isDirty: FIN_INFO_FRM.meta.isDirty,
          validate: validationActions.validateIRAForm,
          form: 'FIN_INFO_FRM',
          validForm: FIN_INFO_FRM.meta.isValid,
          stepToBeRendered: 1,
          disableKeyDown: true,
          bankSummary: false,
        },
        {
          name: 'Account type',
          component: <AccountType />,
          isValid: ACC_TYPES_FRM.meta.isValid ? '' : stepToBeRendered > 1 ? 'error' : '',
          validate: validationActions.validateIRAForm,
          isDirty: ACC_TYPES_FRM.meta.isDirty,
          form: 'ACC_TYPES_FRM',
          stepToBeRendered: 2,
          validForm: ACC_TYPES_FRM.meta.isValid,
          disableKeyDown: true,
          bankSummary: false,
        },
        {
          name: 'Funding',
          component: <Funding />,
          validate: validationActions.validateIRAForm,
          isValid: FUNDING_FRM.meta.isValid ? '' : stepToBeRendered > 2 ? 'error' : '',
          isDirty: FUNDING_FRM.meta.isDirty,
          form: 'FUNDING_FRM',
          stepToBeRendered: 3,
          disableKeyDown: true,
          validForm: FUNDING_FRM.meta.isValid,
          bankSummary: false,
        },
        {
          name: 'Link bank',
          component: <Plaid />,
          isValid: (formIraAddFunds.meta.isValid && (isAccountPresent || formLinkBankManually.meta.isValid)) ? '' : stepToBeRendered > 3 ? 'error' : '',
          isDirty: isPlaidDirty,
          disableNextButton: !linkbankSummary,
          validate: validationActions.validateLinkBankForm,
          stepToBeRendered: 4,
          disableKeyDown: true,
          validForm: isAccountPresent,
          bankSummary: linkbankSummary,
        },
        {
          name: 'Identity',
          component: <Identity />,
          isValid: IDENTITY_FRM.meta.isValid ? '' : stepToBeRendered > 4 ? 'error' : '',
          isDirty: IDENTITY_FRM.meta.isDirty && isPlaidDirty,
          validate: validationActions.validateIRAForm,
          form: 'IDENTITY_FRM',
          disableKeyDown: true,
          validForm: IDENTITY_FRM.meta.isValid,
          stepToBeRendered: 5,
          bankSummary: false,
        },
        {
          name: 'Summary',
          isValid: isValidIraForm ? '' : stepToBeRendered > 5 ? 'error' : '',
          // validForm: isValidIraForm,
          component: <Summary />,
        },
      ];
    } else {
      steps =
      [
        {
          name: 'Financial info',
          component: <FinancialInformation />,
          isValid: FIN_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 0 ? 'error' : FIN_INFO_FRM.meta.isDirty ? 'error' : '',
          isDirty: FIN_INFO_FRM.meta.isDirty,
          validate: validationActions.validateIRAForm,
          form: 'FIN_INFO_FRM',
          stepToBeRendered: 1,
          disableKeyDown: true,
          validForm: FIN_INFO_FRM.meta.isValid,
          bankSummary: false,
        },
        {
          name: 'Account type',
          component: <AccountType />,
          validate: validationActions.validateIRAForm,
          isValid: ACC_TYPES_FRM.meta.isValid ? '' : stepToBeRendered > 1 ? 'error' : '',
          isDirty: ACC_TYPES_FRM.meta.isDirty,
          form: 'ACC_TYPES_FRM',
          stepToBeRendered: 2,
          disableKeyDown: true,
          validForm: ACC_TYPES_FRM.meta.isValid,
          bankSummary: false,
        },
        {
          name: 'Funding',
          component: <Funding />,
          validate: validationActions.validateIRAForm,
          isValid: FUNDING_FRM.meta.isValid ? '' : stepToBeRendered > 2 ? 'error' : '',
          isDirty: FUNDING_FRM.meta.isDirty,
          form: 'FUNDING_FRM',
          stepToBeRendered: 3,
          disableKeyDown: true,
          validForm: FUNDING_FRM.meta.isValid,
          bankSummary: false,
        },
        {
          name: 'Identity',
          component: <Identity />,
          isValid: IDENTITY_FRM.meta.isValid ? '' : stepToBeRendered > 3 ? 'error' : '',
          isDirty: IDENTITY_FRM.meta.isDirty,
          validate: validationActions.validateIRAForm,
          form: 'IDENTITY_FRM',
          stepToBeRendered: 4,
          disableKeyDown: true,
          validForm: IDENTITY_FRM.meta.isValid,
          bankSummary: false,
        },
        {
          name: 'Summary',
          component: <Summary />,
          isValid: isValidIraForm ? '' : stepToBeRendered > 4 ? 'error' : '',
          validForm: isValidIraForm,
          bankSummary: false,
        },
      ];
    }
    if (showProcessingModal) {
      return <GsModal open={showProcessingModal} closeModal={this.closeProcessingModal} />;
    }
    return (
      <div className="step-progress">
        <MultiStep isAccountCreation setLinkbankSummary={setLinkBankSummary} isAddFundsScreen={showAddFunds} loaderMsg={createAccountMessage} bankSummary={stepbankSummary} bankSummarySubmit={bankSummarySubmit} disablePrevBtn setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={createAccount} steps={steps} formTitle="IRA account creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
