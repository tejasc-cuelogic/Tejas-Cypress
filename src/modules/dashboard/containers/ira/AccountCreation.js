import React from 'react';
// import { Modal } from 'semantic-ui-react';

import MuliStep from '../../../../helper/MultiStep';
import FinancialInformation from './FinancialInformation';
import AccountType from './AccountType';
import Funding from './Funding';

const steps =
  [
    { name: 'Financial info', component: <FinancialInformation /> },
    { name: 'Account type', component: <AccountType /> },
    { name: 'Funding', component: <Funding /> },
  ];

export default class AccountCreation extends React.Component {
  render() {
    return (
      <div className="step-progress">
        <MuliStep steps={steps} step="IRA Account Creation" setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
