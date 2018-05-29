import React from 'react';
import { inject, observer } from 'mobx-react';

import MuliStep from '../../../../helper/MultiStep';
import NetWorth from './NetWorth';
import IncomeEvidence from './IncomeEvidence';
import Verification from './Verification';

@inject('accountStore')
@observer
export default class Accreditation extends React.Component {
  render() {
    const steps =
    [
      { name: 'Net Worth', component: <NetWorth />, isValid: '' },
      { name: 'Income Evidence', component: <IncomeEvidence />, isValid: '' },
      { name: 'Verification', component: <Verification />, isValid: '' },
    ];

    return (
      <div className="step-progress">
        <MuliStep steps={steps} formTitle="Verify your accreditation" setDashboardWizardStep={this.props.setDashboardWizardStep} />
      </div>
    );
  }
}
