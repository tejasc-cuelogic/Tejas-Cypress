import React from 'react';
import { inject, observer } from 'mobx-react';

import MuliStep from '../../../../helper/MultiStep';
import FinancialInformation from './FinancialInformation';
import AccountType from './AccountType';
import Funding from './Funding';
import Identity from './Identity';
import Summary from './Summary';

@inject('iraAccountStore')
@observer
export default class AccountCreation extends React.Component {
  render() {
    const steps =
    [
      { name: 'Financial info', component: <FinancialInformation />, isValid: this.props.iraAccountStore.isValidIraFinancialInfo ? '' : 'error' },
      { name: 'Account type', component: <AccountType />, isValid: '' },
      { name: 'Funding', component: <Funding />, isValid: '' },
      { name: 'Identity', component: <Identity />, isValid: '' },
      { name: 'Summary', component: <Summary />, isValid: '' },
    ];

    return (
      <div className="step-progress">
        <MuliStep createAccount={this.props.iraAccountStore.createAccount} steps={steps} formTitle="IRA Account Creation" setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
