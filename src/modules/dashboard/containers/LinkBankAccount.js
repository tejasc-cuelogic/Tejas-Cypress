import React from 'react';
// import { Modal } from 'semantic-ui-react';

import MuliStep from '../../../helper/MultiStep';
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
        <MuliStep steps={steps} setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}

