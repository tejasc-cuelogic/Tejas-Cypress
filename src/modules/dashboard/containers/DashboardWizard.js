import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { inject, observer } from 'mobx-react';
import upperFirst from 'lodash/upperFirst';

@inject('authStore', 'uiStore', 'accountStore')
@observer
class DashboardWizard extends Component {
  handleChange = (step) => {
    this.props.uiStore.setDashboardWizardStep(step);
  }

  render() {
    const module = upperFirst(this.props.uiStore.dashboardStep);
    const DashboardModule = Loadable({
      loader: () => (module === 'ConfirmEmailAddress' || module === 'InvestorPersonalDetails' || module === 'ConfirmIdentityForm' || module === 'ConfirmPhoneNumber' || module === 'ConfirmIdentityDocuments' ? import(`../containers/${module}`) : import(`../components/${module}`)),
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
