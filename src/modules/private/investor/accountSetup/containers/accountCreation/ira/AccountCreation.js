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
import AboutIra from './AboutIra';

@inject('uiStore', 'accountStore', 'iraAccountStore', 'userDetailsStore', 'userStore', 'bankAccountStore')
@observer
export default class AccountCreation extends React.Component {
  constructor(props) {
    super(props);
    this.checkIfAccountIsAlreadyPresent('ira');
    if (!this.props.iraAccountStore.isFormSubmitted) {
      this.props.uiStore.setProgress();
      this.props.userDetailsStore.setUserAccDetails('ira');
      this.props.accountStore.setAccTypeChange(1);
    }
  }

  checkIfAccountIsAlreadyPresent = (accountType) => {
    const { checkIfAccountIsAlreadyPresent, getInvestorAccountsRoute } = this.props.userDetailsStore;
    if (checkIfAccountIsAlreadyPresent(accountType)) {
      const route = getInvestorAccountsRoute(accountType);
      this.props.history.push(`/app/account-details/${route}/portfolio`);
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
    this.props.iraAccountStore.setStepToBeRendered(step);
    this.props.uiStore.clearErrors();
  }

  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub).then(() => {
      const { getInvestorAccountsRoute } = this.props.userDetailsStore;
      const route = getInvestorAccountsRoute('ira');
      if (route) {
        this.props.history.push(`/app/account-details/${route}/portfolio`);
      } else {
        this.props.history.push('/app/setup');
      }
    });
  }

  render() {
    let steps = [];
    const {
      inProgress, inProgressArray,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
      createAccountMessage,
      setFieldvalue,
    } = this.props.uiStore;
    const {
      FIN_INFO_FRM,
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
      steps = [
        {
          name: '',
          component: <AboutIra />,
          isValid: false,
          isDirty: false,
          form: '',
          stepToBeRendered: 1,
        },
        {
          name: 'Financial info',
          component: <FinancialInformation />,
          isValid: FIN_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 0 ? 'error' : FIN_INFO_FRM.meta.isDirty ? 'error' : '',
          isDirty: FIN_INFO_FRM.meta.isDirty,
          validate: validationActions.validateIRAForm,
          form: 'FIN_INFO_FRM',
          validForm: FIN_INFO_FRM.meta.isValid,
          stepToBeRendered: 2,
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
          stepToBeRendered: 3,
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
          stepToBeRendered: 4,
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
          stepToBeRendered: 5,
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
          stepToBeRendered: 6,
          bankSummary: false,
        },
        {
          name: 'Confirmation',
          isValid: isValidIraForm ? '' : stepToBeRendered > 5 ? 'error' : '',
          // validForm: isValidIraForm,
          disableNextButton: true,
          component: <Summary handleCreateAccount={this.props.handleCreateAccount} handleLegalDocsBeforeSubmit={this.props.handleLegalDocsBeforeSubmit} />,
        },
      ];
    } else {
      steps = [
        {
          name: '',
          component: <AboutIra />,
          isValid: false,
          isDirty: false,
          form: '',
          stepToBeRendered: 1,
        },
        {
          name: 'Financial info',
          component: <FinancialInformation />,
          isValid: FIN_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 0 ? 'error' : FIN_INFO_FRM.meta.isDirty ? 'error' : '',
          isDirty: FIN_INFO_FRM.meta.isDirty,
          validate: validationActions.validateIRAForm,
          form: 'FIN_INFO_FRM',
          stepToBeRendered: 2,
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
          stepToBeRendered: 3,
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
          stepToBeRendered: 4,
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
          stepToBeRendered: 5,
          disableKeyDown: true,
          validForm: IDENTITY_FRM.meta.isValid,
          bankSummary: false,
        },
        {
          name: 'Confirmation',
          component: <Summary handleCreateAccount={this.props.handleCreateAccount} />,
          disableNextButton: true,
          isValid: isValidIraForm ? '' : stepToBeRendered > 4 ? 'error' : '',
          validForm: isValidIraForm,
          bankSummary: false,
        },
      ];
    }
    return (
      <div className="step-progress">
        <MultiStep isAccountCreation inProgressArray={inProgressArray} setUiStorevalue={setFieldvalue} setLinkbankSummary={setLinkBankSummary} isAddFundsScreen={showAddFunds} loaderMsg={createAccountMessage} bankSummary={stepbankSummary} bankSummarySubmit={bankSummarySubmit} disablePrevBtn setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress || inProgressArray.includes('submitAccountLoader')} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={createAccount} steps={steps} formTitle="IRA account creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
