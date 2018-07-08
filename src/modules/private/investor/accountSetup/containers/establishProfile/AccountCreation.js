import React from 'react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from '../../../../../../helper';
import Employment from './Employment';
import InvestorProfile from './InvestorProfile';
import Finances from './Finances';
import Experience from './Experience';

@inject('uiStore')
@observer
export default class AccountCreation extends React.Component {
  handleMultiStepModalclose = () => {
    this.updateUser();
    this.props.history.push('/app/summary');
  }
  render() {
    const { inProgress } = this.props.uiStore;
    const steps =
    [
      {
        name: 'Employment',
        component: <Employment />,
        isValid: true,
        isDirty: false,
      },
      {
        name: 'Investor Profile',
        component: <InvestorProfile />,
        isValid: true,
        isDirty: false,
      },
      {
        name: 'Finances',
        component: <Finances />,
        isValid: true,
        isDirty: false,
      },
      {
        name: 'Experience',
        component: <Experience />,
        isValid: true,
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
