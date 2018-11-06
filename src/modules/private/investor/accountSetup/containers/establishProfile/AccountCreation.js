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

@inject('uiStore', 'investorProfileStore')
@withRouter
@observer
export default class AccountCreation extends React.Component {
  handleMultiStepModalclose = () => {
    this.props.history.push('/app/summary');
  }
  handleStepChange = (step) => {
    this.props.investorProfileStore.setStepToBeRendered(step);
  }
  navigateToAccCreation = () => {
    const { INVESTMENT_EXP_FORM } = this.props.investorProfileStore;
    if (INVESTMENT_EXP_FORM.meta.isValid) {
      this.props.history.push('/app/summary/account-creation');
    }
  }
  render() {
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = this.props.uiStore;
    const {
      INVESTMENT_EXP_FORM,
      EMPLOYMENT_FORM,
      BROKERAGE_EMPLOYMENT_FORM,
      FINANCES_FORM,
      updateInvestorProfileData,
      PUBLIC_COMPANY_REL_FORM,
      stepToBeRendered,
    } = this.props.investorProfileStore;
    const steps =
    [
      {
        name: 'Overview',
        component: <Overview />,
        isValid: false,
        isDirty: false,
        form: '',
        stepToBeRendered: 1,
      },
      {
        name: 'Employment',
        component: <Employment />,
        isValid: EMPLOYMENT_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: EMPLOYMENT_FORM.meta.isDirty,
        form: 'EMPLOYMENT_FORM',
        stepToBeRendered: 2,
      },
      {
        name: 'Brokerage Employment',
        component: <BrokerageEmployment />,
        isValid: BROKERAGE_EMPLOYMENT_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: BROKERAGE_EMPLOYMENT_FORM.meta.isDirty,
        form: 'BROKERAGE_EMPLOYMENT_FORM',
        stepToBeRendered: 3,
      },
      {
        name: 'Public Company Relations',
        component: <PublicCompanyRelations />,
        isValid: PUBLIC_COMPANY_REL_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: PUBLIC_COMPANY_REL_FORM.meta.isDirty,
        form: 'PUBLIC_COMPANY_REL_FORM',
        stepToBeRendered: 4,
      },
      {
        name: 'Finances',
        component: <Finances />,
        isValid: FINANCES_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: FINANCES_FORM.meta.isDirty,
        form: 'FINANCES_FORM',
        stepToBeRendered: 5,
      },
      {
        name: 'Experience',
        component: <Experience />,
        isValid: INVESTMENT_EXP_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: INVESTMENT_EXP_FORM.meta.isDirty,
        form: 'INVESTMENT_EXP_FORM',
        stepToBeRendered: 6,
      },
    ];

    return (

      <div className="step-progress">
        <MultiStep setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} actionOnNextBtn={this.navigateToAccCreation} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={updateInvestorProfileData} inProgress={inProgress} steps={steps} formTitle="Complete your investor profile" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
