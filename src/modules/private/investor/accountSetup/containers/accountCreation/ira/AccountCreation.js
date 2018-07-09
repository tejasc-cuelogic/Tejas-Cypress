import React from 'react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from '../../../../../../../helper';
import FinancialInformation from './FinancialInformation';
import AccountType from './AccountType';
import Funding from './Funding';
import Identity from './Identity';
import Summary from './Summary';
import { validationActions } from '../../../../../../../services/actions';

@inject('uiStore', 'iraAccountStore', 'userDetailsStore', 'userStore')
@observer
export default class AccountCreation extends React.Component {
  handleMultiStepModalclose = () => {
    this.updateUser();
    this.props.history.push('/app/summary');
    // this.props.setDashboardWizardStep();
  }
  handleStepChange = (step) => {
    this.props.iraAccountStore.setStepToBeRendered(step);
  }
  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  render() {
    const { inProgress } = this.props.uiStore;
    const steps =
    [
      {
        name: 'Financial info',
        component: <FinancialInformation />,
        isValid: this.props.iraAccountStore.isValidFinancialInfo ? '' : 'error',
        isDirty: this.props.iraAccountStore.FIN_INFO_FRM.meta.isDirty,
        validate: validationActions.validateIRAFinancialInfo,
      },
      {
        name: 'Account type',
        component: <AccountType />,
        isValid: '',
        isDirty: this.props.iraAccountStore.ACC_TYPES_FRM.meta.isDirty,
      },
      {
        name: 'Funding',
        component: <Funding />,
        isValid: '',
        isDirty: this.props.iraAccountStore.FUNDING_FRM.meta.isDirty,
      },
      {
        name: 'Identity',
        component: <Identity />,
        isValid: this.props.iraAccountStore.isValidIdentity ? '' : 'error',
        isDirty: this.props.iraAccountStore.IDENTITY_FRM.meta.isDirty,
        validate: validationActions.validateIRAIdentityInfo,
      },
      {
        name: 'Summary',
        component: <Summary />,
        isValid: '',
      },
    ];

    return (
      <div className="step-progress">
        <MultiStep inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={this.props.iraAccountStore.stepToBeRendered} createAccount={this.props.iraAccountStore.createAccount} steps={steps} formTitle="IRA Account Creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
