import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import MuliStep from '../../../../helper/MultiStep';
import FinancialInformation from './FinancialInformation';
import validationActions from '../../../../actions/validation';
import General from './General';
import FinancilInfo from './FinancialInfo';
import PersonalInformation from './PersonalInformation';
import FormationDocuments from './FormationDocuments';
import LinkBankAccount from '../individual/LinkBankPlaid';
import Summary from './Summary';

@inject('uiStore', 'accountStore', 'entityAccountStore', 'userDetailsStore', 'userStore')
@observer
export default class AccountCreation extends React.Component {
  handleMultiStepModalclose = () => {
    this.updateUser();
    this.props.setDashboardWizardStep();
  }
  handleStepChange = (step) => {
    this.props.entityAccountStore.setStepToBeRendered(step);
  }
  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  render() {
    const { inProgress } = this.props.uiStore;
    const steps =
    [
      {
        name: 'Financial info',
        component: <FinancialInformation />,
        isValid: this.props.entityAccountStore.isValidEntityFinancialInfo ? '' : 'error',
        isDirty: this.props.entityAccountStore.formFinInfo.meta.isDirty,
        validate: validationActions.validateEntityFinancialInfo,
      },
      {
        name: 'General',
        component: <General />,
        isValid: this.props.entityAccountStore.isValidEntityGeneralInfo ? '' : 'error',
        isDirty: this.props.entityAccountStore.formGeneralInfo.meta.isDirty,
        validate: validationActions.validateEntityGeneralInformation,
      },
      {
        name: 'Entity info',
        component: <FinancilInfo />,
        isValid: this.props.entityAccountStore.isValidEntityInfo ? '' : 'error',
        isDirty: this.props.entityAccountStore.formEntityInfo.meta.isDirty,
        validate: validationActions.validateEntityInfo,
      },
      {
        name: 'Personal info',
        component: <PersonalInformation />,
        isValid: this.props.entityAccountStore.isValidPersonalInfo ? '' : 'error',
        isDirty: this.props.entityAccountStore.formPersonalInfo.meta.isDirty,
        validate: validationActions.validateEntityPersonalInfo,
      },
      {
        name: 'Formation doc',
        component: <FormationDocuments />,
        isValid: this.props.entityAccountStore.isValidFormationDoc ? '' : 'error',
        isDirty: this.props.entityAccountStore.formFormationDocuments.meta.isDirty,
        validate: validationActions.validateEntityFormationDoc,
      },
      {
        name: 'Link bank',
        component: <LinkBankAccount />,
        isValid: '',
        isDirty: !_.isEmpty(this.props.accountStore.plaidBankDetails) ||
        this.props.accountStore.formLinkBankManually.meta.isDirty,
        validate: validationActions.validateLinkBankForm,
      },
      {
        name: 'Summary',
        component: <Summary />,
        isValid: '',
      },
    ];
    return (
      <div className="step-progress">
        <MuliStep inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={this.props.entityAccountStore.stepToBeRendered} createAccount={this.props.entityAccountStore.createAccount} steps={steps} formTitle="Entity Account Creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
