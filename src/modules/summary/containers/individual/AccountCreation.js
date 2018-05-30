import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import MuliStep from '../../../../helper/MultiStep';
import LinkBankPlaid from './LinkBankPlaid';
import Summary from './Summary';
import AddFunds from './AddFunds';

@inject('accountStore', 'individualAccountStore', 'uiStore')
@observer
export default class AccountCreation extends React.Component {
  handleStepChange = (step) => {
    this.props.individualAccountStore.setStepToBeRendered(step);
  }
  render() {
    const steps =
    [
      {
        name: 'Link Bank',
        component: <LinkBankPlaid />,
        isValid: '',
        isDirty: !_.isEmpty(this.props.accountStore.plaidBankDetails) ||
        this.props.accountStore.formLinkBankManually.meta.isDirty,
      },
      {
        name: 'Add funds',
        component: <AddFunds />,
        isValid: this.props.accountStore.isValidAddFunds ? '' : 'error',
      },
      {
        name: 'Summary',
        component: <Summary />,
        isValid: '',
      },
    ];
    return (
      <div className="step-progress">
        <MuliStep setStepTobeRendered={this.handleStepChange} stepToBeRendered={this.props.individualAccountStore.stepToBeRendered} formTitle="Individual Account Creation" steps={steps} createAccount={this.props.individualAccountStore.createAccount} setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
