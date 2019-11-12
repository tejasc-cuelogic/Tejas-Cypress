import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from '../../../../../../helper';
import Employment from './Employment';
import BrokerageEmployment from './BrokerageEmployment';
import PublicCompanyRelations from './PublicCompanyRel';
import Overview from './overview';
import Finances from './Finances';
import Experience from './Experience';

@inject('uiStore', 'investorProfileStore', 'userDetailsStore', 'userStore', 'nsUiStore')
@withRouter
@observer
export default class AccountCreation extends React.Component {
  constructor(props) {
    super(props);
    this.props.userDetailsStore.setUserAccDetails();
  }

  handleMultiStepModalclose = () => {
    if (this.props.refUrl) {
      this.props.history.push(this.props.refUrl);
    } else {
      this.props.history.push('/app/summary');
    }
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }

  handleStepChange = (step) => {
    this.props.investorProfileStore.setStepToBeRendered(step);
    this.props.uiStore.clearErrors();
  }

  render() {
    const {
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = this.props.uiStore;
    const { isLoading } = this.props.nsUiStore;
    const {
      INVESTMENT_EXP_FRM,
      EMPLOYMENT_STATUS_FRM,
      BROKERAGE_EMPLOYMENT_FRM,
      FINANCIAL_INFO_FRM,
      upsertInvestorProfile,
      PUBLIC_COMPANY_REL_FRM,
      stepToBeRendered,
    } = this.props.investorProfileStore;
    const steps = [
      {
        name: 'Overview',
        component: <Overview />,
        isValid: false,
        isDirty: false,
        form: '',
        stepToBeRendered: 1,
        disablePrevButton: true,
        disableNextButton: true,
      },
      {
        name: 'Employment Status',
        component: <Employment />,
        isValid: EMPLOYMENT_STATUS_FRM.meta.isValid ? '' : stepToBeRendered > 1 ? 'error' : '',
        isDirty: EMPLOYMENT_STATUS_FRM.meta.isDirty,
        validForm: EMPLOYMENT_STATUS_FRM.meta.isValid,
        form: 'EMPLOYMENT_STATUS_FRM',
        stepToBeRendered: 2,
        disableKeyDown: true,
      },
      {
        name: 'Brokerage Employment',
        component: <BrokerageEmployment />,
        isValid: BROKERAGE_EMPLOYMENT_FRM.meta.isValid ? '' : stepToBeRendered > 2 ? 'error' : '',
        isDirty: BROKERAGE_EMPLOYMENT_FRM.meta.isDirty,
        form: 'BROKERAGE_EMPLOYMENT_FRM',
        validForm: BROKERAGE_EMPLOYMENT_FRM.meta.isValid,
        stepToBeRendered: 3,
        disableKeyDown: true,
      },
      {
        name: 'Public Company Relations',
        component: <PublicCompanyRelations />,
        isValid: PUBLIC_COMPANY_REL_FRM.meta.isValid ? '' : stepToBeRendered > 3 ? 'error' : '',
        isDirty: PUBLIC_COMPANY_REL_FRM.meta.isDirty,
        form: 'PUBLIC_COMPANY_REL_FRM',
        validForm: PUBLIC_COMPANY_REL_FRM.meta.isValid,
        stepToBeRendered: 4,
        disableKeyDown: true,
      },
      {
        name: 'Financial Information',
        component: <Finances />,
        isValid: FINANCIAL_INFO_FRM.meta.isValid ? '' : stepToBeRendered > 4 ? 'error' : '',
        isDirty: FINANCIAL_INFO_FRM.meta.isDirty,
        form: 'FINANCIAL_INFO_FRM',
        validForm: FINANCIAL_INFO_FRM.meta.isValid,
        stepToBeRendered: 5,
        disableKeyDown: true,
      },
      {
        name: 'Investment Experience',
        component: <Experience />,
        isValid: INVESTMENT_EXP_FRM.meta.isValid ? '' : stepToBeRendered > 5 ? 'error' : '',
        isDirty: INVESTMENT_EXP_FRM.meta.isDirty,
        form: 'INVESTMENT_EXP_FRM',
        validForm: INVESTMENT_EXP_FRM.meta.isValid,
        stepToBeRendered: 6,
        disableNextButton: true,
        disableKeyDown: true,
      },
    ];

    return (
      <div className="step-progress">
        <MultiStep isAccountCreation disablePrevBtn setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={upsertInvestorProfile} inProgress={isLoading} steps={steps} formTitle="Complete your investor profile" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
