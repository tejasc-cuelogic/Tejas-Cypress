import React from 'react';

import MuliStep from '../../../../helper/MultiStep';
import LinkBankAccountPlaid from './LinkBankAccountPlaid';
import CreateAccount from './CreateAccount';

const steps =
  [
    { name: 'Link Bank', component: <LinkBankAccountPlaid /> },
    { name: 'Summary', component: <CreateAccount /> },
  ];

export default class LinkBankAccount extends React.Component {
  render() {
    return (
      <div className="step-progress">
        <MuliStep step="Individual Account Creation" steps={steps} setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
