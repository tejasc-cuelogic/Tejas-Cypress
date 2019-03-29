import React from 'react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from '../../../../../../../helper';
import FinancialInformation from './FinancialInformation';
import { validationActions } from '../../../../../../../services/actions';
import General from './General';
import FinancilInfo from './FinancialInfo';
import PersonalInformation from './PersonalInformation';
import FormationDocuments from './FormationDocuments';
import { Plaid } from '../../../../../shared/bankAccount';
import Summary from './Summary';
import GsModal from '../../../components/GsProcessingModal';

@inject('uiStore', 'accountStore', 'bankAccountStore', 'entityAccountStore', 'userDetailsStore', 'userStore', 'investmentLimitStore')
@observer
export default class AccountCreation extends React.Component {
  componentWillMount() {
    if (!this.props.entityAccountStore.isFormSubmitted) {
      this.props.uiStore.setProgress();
      this.props.userDetailsStore.setUserAccDetails('entity');
      this.props.accountStore.setAccTypeChange(2);
    }
    this.props.investmentLimitStore.getInvestedAmount();
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
    this.props.entityAccountStore.setStepToBeRendered(step);
    this.props.uiStore.clearErrors();
  }
  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  closeProcessingModal = () => {
    const { partialInvestNowSessionURL, setPartialInvestmenSession } = this.props.userDetailsStore;
    this.props.entityAccountStore.setFieldValue('showProcessingModal', false);
    if (partialInvestNowSessionURL) {
      this.props.history.push(partialInvestNowSessionURL);
      setPartialInvestmenSession();
    } else {
      this.props.history.push('app/summary');
    }
  }
  render() {
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
      createAccountMessage,
    } = this.props.uiStore;
    const {
      PERSONAL_INFO_FRM,
      FIN_INFO_FRM,
      GEN_INFO_FRM,
      TRUST_INFO_FRM,
      FORM_DOCS_FRM,
      stepToBeRendered,
      createAccount,
      isValidEntityForm, showProcessingModal,
    } = this.props.entityAccountStore;
    const {
      formEntityAddFunds, isAccountPresent, formLinkBankManually,
      isEntityPlaidDirty, linkbankSummary, bankSummarySubmit,
      stepbankSummary,
    } = this.props.bankAccountStore;
    const steps =
      [
        {
          name: 'Financial info',
          component: <FinancialInformation />,
          isValid: FIN_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 0 ? 'error' : FIN_INFO_FRM.meta.isDirty ? 'error' : '',
          isDirty: FIN_INFO_FRM.meta.isDirty,
          validate: validationActions.validateEntityFinancialInfo,
          form: 'FIN_INFO_FRM',
          stepToBeRendered: 1,
          validForm: FIN_INFO_FRM.meta.isValid,
          bankSummary: false,
        },
        {
          name: 'General',
          component: <General />,
          isValid: GEN_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 1 ? 'error' : '',
          isDirty: GEN_INFO_FRM.meta.isDirty,
          validate: validationActions.validateEntityGeneralInformation,
          form: 'GEN_INFO_FRM',
          stepToBeRendered: 2,
          validForm: GEN_INFO_FRM.meta.isValid,
          bankSummary: false,
        },
        {
          name: 'Trust Status',
          component: <FinancilInfo />,
          isValid: TRUST_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 2 ? 'error' : '',
          isDirty: TRUST_INFO_FRM.meta.isDirty,
          validate: validationActions.validateEntityInfo,
          form: 'TRUST_INFO_FRM',
          stepToBeRendered: 3,
          validForm: TRUST_INFO_FRM.meta.isValid,
          bankSummary: false,
        },
        {
          name: 'Personal info',
          component: <PersonalInformation />,
          isValid: PERSONAL_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 3 ? 'error' : '',
          isDirty: PERSONAL_INFO_FRM.meta.isDirty,
          validate: validationActions.validateEntityPersonalInfo,
          form: 'PERSONAL_INFO_FRM',
          validForm: PERSONAL_INFO_FRM.meta.isValid,
          stepToBeRendered: 4,
          bankSummary: false,
        },
        {
          name: 'Formation doc',
          component: <FormationDocuments />,
          isValid: FORM_DOCS_FRM.meta.isValid ? '' : stepToBeRendered > 4 ? 'error' : '',
          isDirty: FORM_DOCS_FRM.meta.isDirty,
          validate: validationActions.validateEntityFormationDoc,
          form: 'FORM_DOCS_FRM',
          validForm: FORM_DOCS_FRM.meta.isValid,
          stepToBeRendered: 5,
          bankSummary: false,
        },
        {
          name: 'Link bank',
          component: <Plaid />,
          isValid: (formEntityAddFunds.meta.isValid && (isAccountPresent || formLinkBankManually.meta.isValid)) ? '' : stepToBeRendered > 5 ? 'error' : '',
          isDirty: isEntityPlaidDirty,
          validate: validationActions.validateLinkBankForm,
          disableNextButton: !linkbankSummary,
          validForm: isAccountPresent,
          bankSummary: linkbankSummary,
          stepToBeRendered: 6,
        },
        {
          name: 'Summary',
          component: <Summary />,
          isValid: isValidEntityForm ? '' : stepToBeRendered > 6 ? 'error' : '',
          // validForm: isValidEntityForm,
          bankSummary: false,
        },
      ];
    if (showProcessingModal) {
      return <GsModal open={showProcessingModal} closeModal={this.closeProcessingModal} />;
    }
    return (
      <div className="step-progress" >
        <MultiStep loaderMsg={createAccountMessage} page disablePrevBtn bankSummary={stepbankSummary} bankSummarySubmit={bankSummarySubmit} setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={createAccount} steps={steps} formTitle="Entity account creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
