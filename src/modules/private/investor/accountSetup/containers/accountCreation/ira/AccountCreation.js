import React from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
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
    this.props.iraAccountStore.setFieldValue('showProcessingModal', false);
    this.props.history.push('app/summary');
  }
  render() {
    let steps = [];
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
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
      formAddFunds, plaidAccDetails,
      formLinkBankManually, isPlaidDirty,
      linkbankSummary, bankSummarySubmit,
    } = this.props.bankAccountStore;
    if (FUNDING_FRM.fields.fundingType.value === 0) {
      steps =
      [
        {
          name: 'Financial info',
          component: <FinancialInformation />,
          isValid: FIN_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 0 ? 'error' : FIN_INFO_FRM.meta.isDirty ? 'error' : '',
          isDirty: FIN_INFO_FRM.meta.isDirty,
          validate: validationActions.validateIRAFinancialInfo,
          form: 'FIN_INFO_FRM',
          stepToBeRendered: 1,
        },
        {
          name: 'Account type',
          component: <AccountType />,
          isValid: ACC_TYPES_FRM.meta.isValid ? '' : stepToBeRendered > 1 ? 'error' : '',
          isDirty: ACC_TYPES_FRM.meta.isDirty,
          form: 'ACC_TYPES_FRM',
          stepToBeRendered: 2,
        },
        {
          name: 'Funding',
          component: <Funding />,
          isValid: FUNDING_FRM.meta.isValid ? '' : stepToBeRendered > 2 ? 'error' : '',
          isDirty: FUNDING_FRM.meta.isDirty,
          form: 'FUNDING_FRM',
          stepToBeRendered: 3,
        },
        {
          name: 'Link bank',
          component: <Plaid />,
          isValid: (formAddFunds.meta.isValid || !isEmpty(plaidAccDetails) || formLinkBankManually.meta.isValid) ? '' : stepToBeRendered > 3 ? 'error' : '',
          isDirty: isPlaidDirty,
          disableNextButton: !linkbankSummary,
          validate: validationActions.validateLinkBankForm,
          stepToBeRendered: 4,
        },
        {
          name: 'Identity',
          component: <Identity />,
          isValid: IDENTITY_FRM.meta.isValid ? '' : stepToBeRendered > 4 ? 'error' : '',
          isDirty: IDENTITY_FRM.meta.isDirty && isPlaidDirty,
          validate: validationActions.validateIRAIdentityInfo,
          form: 'IDENTITY_FRM',
          stepToBeRendered: 5,
        },
        {
          name: 'Summary',
          isValid: isValidIraForm ? '' : stepToBeRendered > 5 ? 'error' : '',
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
          validate: validationActions.validateIRAFinancialInfo,
          form: 'FIN_INFO_FRM',
          stepToBeRendered: 1,
        },
        {
          name: 'Account type',
          component: <AccountType />,
          isValid: ACC_TYPES_FRM.meta.isValid ? '' : stepToBeRendered > 1 ? 'error' : '',
          isDirty: ACC_TYPES_FRM.meta.isDirty,
          form: 'ACC_TYPES_FRM',
          stepToBeRendered: 2,
        },
        {
          name: 'Funding',
          component: <Funding />,
          isValid: FUNDING_FRM.meta.isValid ? '' : stepToBeRendered > 2 ? 'error' : '',
          isDirty: FUNDING_FRM.meta.isDirty,
          form: 'FUNDING_FRM',
          stepToBeRendered: 3,
        },
        {
          name: 'Identity',
          component: <Identity />,
          isValid: IDENTITY_FRM.meta.isValid ? '' : stepToBeRendered > 3 ? 'error' : '',
          isDirty: IDENTITY_FRM.meta.isDirty,
          validate: validationActions.validateIRAIdentityInfo,
          form: 'IDENTITY_FRM',
          stepToBeRendered: 4,
        },
        {
          name: 'Summary',
          component: <Summary />,
          isValid: isValidIraForm ? '' : stepToBeRendered > 4 ? 'error' : '',
        },
      ];
    }
    if (showProcessingModal) {
      return <GsModal open={showProcessingModal} closeModal={this.closeProcessingModal} />;
    }
    return (
      <div className="step-progress">
        <MultiStep bankSummary={linkbankSummary} bankSummarySubmit={bankSummarySubmit} disablePrevBtn setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={createAccount} steps={steps} formTitle="IRA account creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
