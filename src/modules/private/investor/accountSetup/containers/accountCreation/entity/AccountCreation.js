import React from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { MultiStep } from '../../../../../../../helper';
import FinancialInformation from './FinancialInformation';
import { validationActions } from '../../../../../../../services/actions';
import General from './General';
import FinancilInfo from './FinancialInfo';
import PersonalInformation from './PersonalInformation';
import FormationDocuments from './FormationDocuments';
import { Plaid } from '../../../../../shared/bankAccount';
import Summary from './Summary';

@inject('uiStore', 'accountStore', 'bankAccountStore', 'entityAccountStore', 'userDetailsStore', 'userStore')
@observer
export default class AccountCreation extends React.Component {
  componentWillMount() {
    this.props.accountStore.setAccTypeChange(2);
  }
  handleMultiStepModalclose = () => {
    this.updateUser();
    this.props.history.push('/app/summary');
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
        isValid: this.props.entityAccountStore.FIN_INFO_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: this.props.entityAccountStore.FIN_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityFinancialInfo,
        form: 'FIN_INFO_FRM',
        stepToBeRendered: 1,
      },
      {
        name: 'General',
        component: <General />,
        isValid: this.props.entityAccountStore.GEN_INFO_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: this.props.entityAccountStore.GEN_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityGeneralInformation,
        form: 'GEN_INFO_FRM',
        stepToBeRendered: 2,
      },
      {
        name: 'Entity info',
        component: <FinancilInfo />,
        isValid: this.props.entityAccountStore.TRUST_INFO_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: this.props.entityAccountStore.TRUST_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityInfo,
        form: 'TRUST_INFO_FRM',
        stepToBeRendered: 3,
      },
      {
        name: 'Personal info',
        component: <PersonalInformation />,
        isValid: this.props.entityAccountStore.PERSONAL_INFO_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: this.props.entityAccountStore.PERSONAL_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityPersonalInfo,
        form: 'PERSONAL_INFO_FRM',
        stepToBeRendered: 4,
      },
      {
        name: 'Formation doc',
        component: <FormationDocuments />,
        isValid: this.props.entityAccountStore.FORM_DOCS_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: this.props.entityAccountStore.FORM_DOCS_FRM.meta.isDirty,
        validate: validationActions.validateEntityFormationDoc,
        form: 'FORM_DOCS_FRM',
        stepToBeRendered: 5,
      },
      {
        name: 'Link bank',
        component: <Plaid />,
        isValid: '',
        isDirty: !isEmpty(this.props.bankAccountStore.plaidBankDetails) ||
        this.props.bankAccountStore.formLinkBankManually.meta.isDirty,
        validate: validationActions.validateLinkBankForm,
        stepToBeRendered: 6,
      },
      {
        name: 'Summary',
        component: <Summary />,
        isValid: '',
      },
    ];
    return (
      <div className="step-progress">
        <MultiStep inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={this.props.entityAccountStore.stepToBeRendered} createAccount={this.props.entityAccountStore.createAccount} steps={steps} formTitle="Entity Account Creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
