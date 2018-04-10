import React from 'react';

import MuliStep from '../../../../helper/MultiStep';
import FinancialInformation from './FinancialInformation';
import General from './General';
import FinancilInfo from './FinancialInfo';
import PersonalInformation from './PersonalInformation';
import FormationDocuments from './FormationDocuments';
import LinkBankAccount from './LinkBankAccount';
import Summary from './Summary';

const steps =
  [
    { name: 'Financial info', component: <FinancialInformation /> },
    { name: 'General', component: <General /> },
    { name: 'Financial info', component: <FinancilInfo /> },
    { name: 'Personal info', component: <PersonalInformation /> },
    { name: 'Formation doc', component: <FormationDocuments /> },
    { name: 'Link bank', component: <LinkBankAccount /> },
    { name: 'Summary', component: <Summary /> },
  ];

export default class AccountCreation extends React.Component {
  render() {
    return (
      <div className="step-progress">
        <MuliStep steps={steps} step="Entity Account Creation" setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
