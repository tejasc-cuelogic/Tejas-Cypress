import React from 'react';
// import { Modal } from 'semantic-ui-react';

import MuliStep from '../../../../helper/MultiStep';
import FinancialInformation from './FinancialInformation';
import AccountType from './AccountType';
import Funding from './Funding';
import Identity from './Identity';
import Summary from './Summary';

const steps =
  [
    { name: 'Financial info', component: <FinancialInformation /> },
    { name: 'Account type', component: <AccountType /> },
    { name: 'Funding', component: <Funding /> },
    { name: 'Identity', component: <Identity /> },
    { name: 'Summary', component: <Summary /> },
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
