import React from 'react';

import MuliStep from '../../../../helper/MultiStep';
import LinkBankPlaid from './LinkBankPlaid';
import Summary from './Summary';
import AddFunds from './AddFunds';

const steps =
  [
    { name: 'Link Bank', component: <LinkBankPlaid />, isValid: '' },
    { name: 'Add funds', component: <AddFunds />, isValid: '' },
    { name: 'Summary', component: <Summary />, isValid: '' },
  ];

export default class AccountCreation extends React.Component {
  render() {
    return (
      <div className="step-progress">
        <MuliStep formTitle="Individual Account Creation" steps={steps} setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
