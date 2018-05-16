import React from 'react';
import { inject, observer } from 'mobx-react';

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

@inject('individualAccountStore')
@observer
export default class AccountCreation extends React.Component {
  componentWillUnmount() {
    this.props.individualAccountStore.setStepToBeRendered(0);
  }
  render() {
    return (
      <div className="step-progress">
        <MuliStep stepToBeRendered={this.props.individualAccountStore.stepToBeRendered} formTitle="Individual Account Creation" steps={steps} setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
