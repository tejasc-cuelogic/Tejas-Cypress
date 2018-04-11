import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { inject, observer } from 'mobx-react';

@inject('authStore', 'uiStore', 'accountStore')
@observer
class DashboardWizard extends Component {
  handleChange = (step) => {
    this.props.uiStore.setDashboardWizardStep(step);
  }

  render() {
    const module = this.props.uiStore.dashboardStep;
    const DashboardModule = Loadable({
      loader: () => (module === `${this.props.accountStore.accountType}/AccountCreation` || module === `${this.props.accountStore.accountType}/LinkBankAccount` || module === 'InvestorPersonalDetails' || module === 'ConfirmIdentityForm' || module === 'ConfirmIdentityDocuments' || module === 'ConfirmPhoneNumber' ? import(`../containers/${module}`) : import(`../components/${module}`)),
      loading() {
        return <div>Loading...</div>;
      },
    });

    return (
      <div>
        <DashboardModule {...this.props} setDashboardWizardStep={this.handleChange} />
      </div>
    );
  }
}

export default DashboardWizard;
