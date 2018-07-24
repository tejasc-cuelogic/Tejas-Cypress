import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from '../../../../../../helper';
import Employment from './Employment';
import InvestorProfile from './InvestorProfile';
import Finances from './Finances';
import Experience from './Experience';

@inject('uiStore', 'investorProfileStore')
@withRouter
@observer
export default class AccountCreation extends React.Component {
  handleMultiStepModalclose = () => {
    this.props.history.push('/app/summary');
  }
  navigateToAccCreation = () => {
    this.props.history.push('/app/summary/account-creation');
  }
  render() {
    const { inProgress } = this.props.uiStore;
    const steps =
    [
      {
        name: 'Employment',
        component: <Employment />,
        isValid: this.props.investorProfileStore.EMPLOYMENT_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: this.props.investorProfileStore.EMPLOYMENT_FORM.meta.isDirty,
        form: 'EMPLOYMENT_FORM',
        stepToBeRendered: 1,
      },
      {
        name: 'Investor Profile',
        component: <InvestorProfile />,
        isValid: this.props.investorProfileStore.INVESTOR_PROFILE_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: this.props.investorProfileStore.INVESTOR_PROFILE_FORM.meta.isDirty,
        form: 'INVESTOR_PROFILE_FORM',
        stepToBeRendered: 2,
      },
      {
        name: 'Finances',
        component: <Finances />,
        isValid: this.props.investorProfileStore.FINANCES_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: this.props.investorProfileStore.FINANCES_FORM.meta.isDirty,
        form: 'FINANCES_FORM',
        stepToBeRendered: 3,
      },
      {
        name: 'Experience',
        component: <Experience />,
        isValid: this.props.investorProfileStore.INVESTMENT_EXPERIENCE.meta.isFieldValid ? '' : 'error',
        isDirty: this.props.investorProfileStore.INVESTMENT_EXPERIENCE.meta.isDirty,
        form: 'INVESTMENT_EXPERIENCE',
        stepToBeRendered: 3,
      },
    ];

    return (
      <div className="step-progress">
        <MultiStep actionOnNextBtn={this.navigateToAccCreation} stepToBeRendered={this.props.investorProfileStore.stepToBeRendered} createAccount={this.props.investorProfileStore.updateInvestorProfileData} inProgress={inProgress} steps={steps} formTitle="Complete your investor profile" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
