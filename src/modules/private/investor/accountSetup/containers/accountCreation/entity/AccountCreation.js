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
    this.props.bankAccountStore.setBankLinkInterface('list');
  }
  handleStepChange = (step) => {
    this.props.entityAccountStore.setStepToBeRendered(step);
  }
  updateUser = () => {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  render() {
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = this.props.uiStore;
    const {
      PERSONAL_INFO_FRM,
      FIN_INFO_FRM,
      GEN_INFO_FRM,
      TRUST_INFO_FRM,
      FORM_DOCS_FRM,
      stepToBeRendered,
      createAccount,
    } = this.props.entityAccountStore;
    const { plaidBankDetails, formLinkBankManually } = this.props.bankAccountStore;
    const steps =
    [
      {
        name: 'Financial info',
        component: <FinancialInformation />,
        isValid: FIN_INFO_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: FIN_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityFinancialInfo,
        form: 'FIN_INFO_FRM',
        stepToBeRendered: 1,
      },
      {
        name: 'General',
        component: <General />,
        isValid: GEN_INFO_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: GEN_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityGeneralInformation,
        form: 'GEN_INFO_FRM',
        stepToBeRendered: 2,
      },
      {
        name: 'Entity info',
        component: <FinancilInfo />,
        isValid: TRUST_INFO_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: TRUST_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityInfo,
        form: 'TRUST_INFO_FRM',
        stepToBeRendered: 3,
      },
      {
        name: 'Personal info',
        component: <PersonalInformation />,
        isValid: PERSONAL_INFO_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: PERSONAL_INFO_FRM.meta.isDirty,
        validate: validationActions.validateEntityPersonalInfo,
        form: 'PERSONAL_INFO_FRM',
        stepToBeRendered: 4,
      },
      {
        name: 'Formation doc',
        component: <FormationDocuments />,
        isValid: FORM_DOCS_FRM.meta.isFieldValid ? '' : 'error',
        isDirty: FORM_DOCS_FRM.meta.isDirty,
        validate: validationActions.validateEntityFormationDoc,
        form: 'FORM_DOCS_FRM',
        stepToBeRendered: 5,
      },
      {
        name: 'Link bank',
        component: <Plaid />,
        isValid: '',
        isDirty: !isEmpty(plaidBankDetails) ||
        formLinkBankManually.meta.isDirty,
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
      <div className="step-progress" >
        <MultiStep setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={createAccount} steps={steps} formTitle="Entity Account Creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
