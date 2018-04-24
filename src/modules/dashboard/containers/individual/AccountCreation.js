import React from 'react';

import MuliStep from '../../../../helper/MultiStep';
import LinkBankAccountPlaid from './LinkBankAccountPlaid';
import CreateAccount from './CreateAccount';

const steps =
  [
    { name: 'Link Bank', component: <LinkBankAccountPlaid />, isValid: '' },
    { name: 'Summary', component: <CreateAccount />, isValid: '' },
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
