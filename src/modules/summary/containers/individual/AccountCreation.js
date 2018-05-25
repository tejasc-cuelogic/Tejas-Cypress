import React from 'react';
import { inject, observer } from 'mobx-react';

import MuliStep from '../../../../helper/MultiStep';
import LinkBankPlaid from './LinkBankPlaid';
import Summary from './Summary';
import AddFunds from './AddFunds';

@inject('individualAccountStore', 'uiStore')
@observer
export default class AccountCreation extends React.Component {
  render() {
    const steps =
    [
      { name: 'Link Bank', component: <LinkBankPlaid />, isValid: this.props.individualAccountStore.isValidLinkBankAccountForm && typeof this.props.uiStore.errors === 'undefined' ? '' : 'error' },
      { name: 'Add funds', component: <AddFunds />, isValid: this.props.individualAccountStore.isValidAddFunds ? '' : 'error' },
      { name: 'Summary', component: <Summary />, isValid: '' },
    ];
    return (
      <div className="step-progress">
        <MuliStep stepToBeRendered={this.props.individualAccountStore.stepToBeRendered} formTitle="Individual Account Creation" steps={steps} setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
