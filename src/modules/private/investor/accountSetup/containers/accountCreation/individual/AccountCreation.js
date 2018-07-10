import React from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';

import { MultiStep } from '../../../../../../../helper';
import { Plaid, AddFunds } from '../../../../../shared/bankAccount';
import Summary from './Summary';

@inject('uiStore', 'bankAccountStore', 'individualAccountStore', 'userStore', 'userDetailsStore')
@observer
export default class AccountCreation extends React.Component {
  handleMultiStepModalclose = () => {
    this.updateUser();
    this.props.history.push('/app/summary');
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
        component: <Plaid />,
        isValid: '',
        isDirty: !isEmpty(this.props.bankAccountStore.plaidBankDetails) ||
        this.props.bankAccountStore.formLinkBankManually.meta.isDirty,
      },
      {
        name: 'Add funds',
        component: <AddFunds />,
        isValid: this.props.bankAccountStore.formAddFunds.meta.isValid ? '' : 'error',
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
