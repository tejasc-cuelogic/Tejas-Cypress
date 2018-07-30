import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from '../../../../../../helper';
import Employment from './Employment';
import InvestorProfile from './InvestorProfile';
import Finances from './Finances';
import Experience from './Experience';

@inject('uiStore')
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
    this.props.history.push('/app/summary/account-creation');
  }
  render() {
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = this.props.uiStore;
    const {
      INVESTOR_PROFILE_FORM,
      INVESTMENT_EXP_FORM,
      EMPLOYMENT_FORM,
      FINANCES_FORM,
      updateInvestorProfileData,
      stepToBeRendered,
    } = this.props.investorProfileStore;
    const steps =
    [
      {
        name: 'Employment',
        component: <Employment />,
        isValid: EMPLOYMENT_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: EMPLOYMENT_FORM.meta.isDirty,
        form: 'EMPLOYMENT_FORM',
        stepToBeRendered: 1,
      },
      {
        name: 'Investor Profile',
        component: <InvestorProfile />,
        isValid: INVESTOR_PROFILE_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: INVESTOR_PROFILE_FORM.meta.isDirty,
        form: 'INVESTOR_PROFILE_FORM',
        stepToBeRendered: 2,
      },
      {
        name: 'Finances',
        component: <Finances />,
        isValid: FINANCES_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: FINANCES_FORM.meta.isDirty,
        form: 'FINANCES_FORM',
        stepToBeRendered: 3,
      },
      {
        name: 'Experience',
        component: <Experience />,
        isValid: INVESTMENT_EXP_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: INVESTMENT_EXP_FORM.meta.isDirty,
        form: 'INVESTMENT_EXP_FORM',
        stepToBeRendered: 3,
      },
    ];

    return (

      <div className="step-progress">
        <MultiStep setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} actionOnNextBtn={this.navigateToAccCreation} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={updateInvestorProfileData} inProgress={inProgress} steps={steps} formTitle="Complete your investor profile" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
