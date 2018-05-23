import React from 'react';
import { inject, observer } from 'mobx-react';

import MuliStep from '../../../../helper/MultiStep';
import FinancialInformation from './FinancialInformation';
import AccountType from './AccountType';
import Funding from './Funding';
import Identity from './Identity';
import Summary from './Summary';
import validationActions from '../../../../actions/validation';

@inject('iraAccountStore', 'userDetailsStore', 'userStore')
@observer
export default class AccountCreation extends React.Component {
  render() {
    const steps =
    [
      {
        name: 'Financial info',
        component: <FinancialInformation />,
        isValid: this.props.iraAccountStore.isValidIraFinancialInfo ? '' : 'error',
        isDirty: this.props.iraAccountStore.formFinInfo.meta.isDirty,
        validate: validationActions.validateIRAFinancialInfo,
      },
      {
        name: 'Account type',
        component: <AccountType />,
        isValid: '',
        isDirty: this.props.iraAccountStore.formAccTypes.meta.isDirty,
      },
      {
        name: 'Funding',
        component: <Funding />,
        isValid: '',
        isDirty: this.props.iraAccountStore.formFunding.meta.isDirty,
      },
      {
        name: 'Identity',
        component: <Identity />,
        isValid: '',
        isDirty: this.props.iraAccountStore.formIdentity.meta.isDirty,
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
        <MuliStep createAccount={this.props.iraAccountStore.createAccount} steps={steps} formTitle="IRA Account Creation" setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
