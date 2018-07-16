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
  render() {
    const { inProgress } = this.props.uiStore;
    const steps =
    [
      {
        name: 'Employment',
        component: <Employment />,
        isValid: this.props.investorProfileStore.EMPLOYMENT_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: false,
      },
      {
        name: 'Investor Profile',
        component: <InvestorProfile />,
        isValid: this.props.investorProfileStore.INVESTOR_PROFILE_FORM.meta.isFieldValid ? '' : 'error',
        isDirty: false,
      },
      {
        name: 'Finances',
        component: <Finances />,
        isValid: this.props.investorProfileStore.FINANCES.meta.isFieldValid ? '' : 'error',
        isDirty: false,
      },
      {
        name: 'Experience',
        component: <Experience />,
        isValid: this.props.investorProfileStore.INVESTMENT_EXPERIENCE.meta.isFieldValid ? '' : 'error',
        isDirty: false,
      },
    ];

    return (
      <div className="step-progress">
        <MultiStep inProgress={inProgress} steps={steps} formTitle="Complete your investor profile" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
