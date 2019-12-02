import React from 'react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from '../../../../../../../helper';
import FinancialInformation from './FinancialInformation';
import { validationActions } from '../../../../../../../services/actions';
import General from './General';
import FinancilInfo from './FinancialInfo';
import PersonalInformation from './PersonalInformation';
import FormationDocuments from './FormationDocuments';
import { Plaid, AddFunds } from '../../../../../shared/bankAccount';
import Summary from './Summary';

@inject('uiStore', 'accountStore', 'bankAccountStore', 'entityAccountStore', 'userDetailsStore', 'userStore', 'investmentLimitStore')
@observer
export default class AccountCreation extends React.Component {
  constructor(props) {
    super(props);
    this.checkIfAccountIsAlreadyPresent('entity');
    if (!this.props.entityAccountStore.isFormSubmitted) {
      this.props.uiStore.setProgress();
      this.props.userDetailsStore.setUserAccDetails('entity');
      this.props.accountStore.setAccTypeChange(2);
    }
    this.props.investmentLimitStore.getInvestedAmount();
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
    this.props.entityAccountStore.setStepToBeRendered(step);
    this.props.uiStore.clearErrors();
  }

  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub).then(() => {
      const { getInvestorAccountsRoute } = this.props.userDetailsStore;
      const route = getInvestorAccountsRoute('entity');
      if (route) {
        this.props.history.push(`/app/account-details/${route}/portfolio`);
      } else {
        this.props.history.push('/app/setup');
      }
    });
  }

  render() {
    const {
      inProgress, inProgressArray,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
      createAccountMessage,
      setFieldvalue,
    } = this.props.uiStore;
    const {
      PERSONAL_INFO_FRM,
      FIN_INFO_FRM,
      GEN_INFO_FRM,
      TRUST_INFO_FRM,
      FORM_DOCS_FRM,
      stepToBeRendered,
      createAccount,
      isValidEntityForm,
    } = this.props.entityAccountStore;
    const {
      formEntityAddFunds, isAccountPresent, formLinkBankManually,
      isPlaidDirty, linkbankSummary,
      setLinkBankSummary, showAddFunds,
    } = this.props.bankAccountStore;
    const steps = [
      {
        name: 'Financial info',
        component: <FinancialInformation />,
        isValid: FIN_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 0 ? 'error' : FIN_INFO_FRM.meta.isDirty ? 'error' : '',
        isDirty: FIN_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityForm,
        form: 'FIN_INFO_FRM',
        stepToBeRendered: 1,
        validForm: FIN_INFO_FRM.meta.isValid,
        disableKeyDown: true,
      },
      {
        name: 'General',
        component: <General />,
        isValid: GEN_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 1 ? 'error' : '',
        isDirty: GEN_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityForm,
        form: 'GEN_INFO_FRM',
        stepToBeRendered: 2,
        disableKeyDown: true,
        validForm: GEN_INFO_FRM.meta.isValid,
      },
      {
        name: 'Trust Status',
        component: <FinancilInfo />,
        isValid: TRUST_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 2 ? 'error' : '',
        isDirty: TRUST_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityForm,
        form: 'TRUST_INFO_FRM',
        stepToBeRendered: 3,
        disableKeyDown: true,
        validForm: TRUST_INFO_FRM.meta.isValid,
      },
      {
        name: 'Personal info',
        component: <PersonalInformation />,
        isValid: PERSONAL_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 3 ? 'error' : '',
        isDirty: PERSONAL_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityForm,
        form: 'PERSONAL_INFO_FRM',
        validForm: PERSONAL_INFO_FRM.meta.isValid,
        disableKeyDown: true,
        stepToBeRendered: 4,
      },
      {
        name: 'Formation doc',
        component: <FormationDocuments />,
        isValid: FORM_DOCS_FRM.meta.isValid ? '' : stepToBeRendered > 4 ? 'error' : '',
        isDirty: FORM_DOCS_FRM.meta.isDirty,
        validate: validationActions.validateEntityForm,
        form: 'FORM_DOCS_FRM',
        validForm: FORM_DOCS_FRM.meta.isValid,
        stepToBeRendered: 5,
        disableKeyDown: true,
      },
      {
        name: 'Link bank',
        component: <Plaid />,
        isValid: isAccountPresent || formLinkBankManually.meta.isValid ? '' : stepToBeRendered > 5 ? 'error' : '',
        isDirty: isPlaidDirty,
        validate: validationActions.validateLinkBankForm,
        disableNextButton: !linkbankSummary,
        validForm: isAccountPresent,
        disableKeyDown: true,
        stepToBeRendered: 6,
      },
      {
        name: 'Add funds',
        component: <AddFunds />,
        isValid: formEntityAddFunds.meta.isValid && isAccountPresent ? '' : stepToBeRendered > 6 ? 'error' : '',
        isDirty: isPlaidDirty,
        validate: validationActions.validateLinkBankForm,
        disableNextButton: !linkbankSummary,
        validForm: isAccountPresent,
        disableKeyDown: true,
        stepToBeRendered: 7,
      },
      {
        name: 'Confirmation',
        component: <Summary handleCreateAccount={this.props.handleCreateAccount} handleLegalDocsBeforeSubmit={this.props.handleLegalDocsBeforeSubmit} />,
        isValid: isValidEntityForm ? '' : stepToBeRendered > 8 ? 'error' : '',
        // validForm: isValidEntityForm,
        disableNextButton: true,
      },
    ];
    return (
      <div className="step-progress">
        <MultiStep isAccountCreation inProgressArray={inProgressArray} setUiStorevalue={setFieldvalue} setLinkbankSummary={setLinkBankSummary} isAddFundsScreen={showAddFunds} loaderMsg={createAccountMessage} page disablePrevBtn setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress || inProgressArray.includes('submitAccountLoader')} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={createAccount} steps={steps} formTitle="Entity account creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
