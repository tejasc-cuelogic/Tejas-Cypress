import React from 'react';
import { inject, observer } from 'mobx-react';

import { MultiStep } from '../../../../../../../helper';
import NetWorth from './NetWorth';
import IncomeEvidence from '../shared/IncomeEvidence';
import Verification from '../shared/Verification';

@inject('uiStore', 'accreditationStore')
@observer
export default class Accreditation extends React.Component {
  handleMultiStepModalclose = () => {
    this.props.history.push('/app/profile-settings/investment-limits');
    const { INCOME_EVIDENCE_FORM, VERIFICATION_REQUEST_FORM } = this.props.accreditationStore;
    this.props.accreditationStore.resetAccreditation(VERIFICATION_REQUEST_FORM);
    this.props.accreditationStore.resetAccreditation(INCOME_EVIDENCE_FORM);
  }
  render() {
    const { NET_WORTH_FORM, INCOME_EVIDENCE_FORM } = this.props.accreditationStore;
    const steps =
    [
      {
        name: 'Net worth',
        component: <NetWorth />,
        isValid: NET_WORTH_FORM.meta.isFieldValid ? '' : 'error',
      },
      {
        name: 'Inc. evidence',
        component: <IncomeEvidence />,
        isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
      },
      {
        name: 'Verification',
        component: <Verification />,
        isValid: '',
      },
    ];
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = this.props.uiStore;

    return (
      <div className="step-progress">
        <MultiStep
          steps={steps}
          formTitle="Verify your accreditation"
          setIsEnterPressed={setIsEnterPressed}
          isEnterPressed={isEnterPressed}
          resetEnterPressed={resetIsEnterPressed}
          inProgress={inProgress}
          handleMultiStepModalclose={this.handleMultiStepModalclose}
        />
      </div>
    );
  }
}
