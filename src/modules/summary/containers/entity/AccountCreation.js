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
    { name: 'Financial info', component: <FinancialInformation />, isValid: '' },
    { name: 'General', component: <General />, isValid: '' },
    { name: 'Financial info', component: <FinancilInfo />, isValid: '' },
    { name: 'Personal info', component: <PersonalInformation />, isValid: '' },
    { name: 'Formation doc', component: <FormationDocuments />, isValid: '' },
    { name: 'Link bank', component: <LinkBankAccount />, isValid: '' },
    { name: 'Summary', component: <Summary />, isValid: '' },
  ];

export default class AccountCreation extends React.Component {
  render() {
    return (
      <div className="step-progress">
        <MuliStep steps={steps} formTitle="Entity Account Creation" setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
