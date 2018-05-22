import React from 'react';
import { inject, observer } from 'mobx-react';
import MuliStep from '../../../../helper/MultiStep';
import FinancialInformation from './FinancialInformation';
import validationActions from '../../../../actions/validation';
import General from './General';
import FinancilInfo from './FinancialInfo';
import PersonalInformation from './PersonalInformation';
import FormationDocuments from './FormationDocuments';
import LinkBankAccount from './LinkBankAccount';
import Summary from './Summary';

@inject('entityAccountStore')
@observer
export default class AccountCreation extends React.Component {
  render() {
    const steps =
    [
      {
        name: 'Financial info',
        component: <FinancialInformation />,
        isValid: '',
        isDirty: this.props.entityAccountStore.formFinInfo.meta.isDirty,
        validate: validationActions.validateEntityFinancialInfo,
      },
      {
        name: 'General',
        component: <General />,
        isValid: '',
        isDirty: this.props.entityAccountStore.formGeneralInfo.meta.isDirty,
      },
      {
        name: 'Financial info',
        component: <FinancilInfo />,
        isValid: '',
        isDirty: this.props.entityAccountStore.formEntityInfo.meta.isDirty,
      },
      {
        name: 'Personal info',
        component: <PersonalInformation />,
        isValid: '',
        isDirty: this.props.entityAccountStore.formPersonalInfo.meta.isDirty,
      },
      {
        name: 'Formation doc',
        component: <FormationDocuments />,
        isValid: '',
        isDirty: this.props.entityAccountStore.formFormationDocuments.meta.isDirty,
      },
      { name: 'Link bank', component: <LinkBankAccount />, isValid: '' },
      { name: 'Summary', component: <Summary />, isValid: '' },
    ];
    return (
      <div className="step-progress">
        <MuliStep createAccount={this.props.entityAccountStore.createAccount} steps={steps} formTitle="Entity Account Creation" setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
