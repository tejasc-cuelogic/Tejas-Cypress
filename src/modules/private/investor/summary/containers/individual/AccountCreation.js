import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { MultiStep } from '../../../../../../helper';
import LinkBankPlaid from './LinkBankPlaid';
import Summary from './Summary';
import AddFunds from './AddFunds';

@inject('uiStore', 'accountStore', 'individualAccountStore', 'userStore', 'userDetailsStore')
@observer
export default class AccountCreation extends React.Component {
  handleMultiStepModalclose = () => {
    // this.props.accountStore.resetLinkBankForm();
    this.updateUser();
    this.props.setDashboardWizardStep();
  }
  handleStepChange = (step) => {
    this.props.individualAccountStore.setStepToBeRendered(step);
  }
  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  render() {
    const { inProgress } = this.props.uiStore;
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
        <MultiStep inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={this.props.individualAccountStore.stepToBeRendered} formTitle="Individual Account Creation" steps={steps} createAccount={this.props.individualAccountStore.createAccount} handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
