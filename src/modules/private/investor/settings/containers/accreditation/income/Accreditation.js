import React from 'react';
import { inject, observer } from 'mobx-react';

import { MultiStep } from '../../../../../../../helper';
import IncomeEvidence from '../shared/IncomeEvidence';
import Verification from '../shared/Verification';

@inject('uiStore', 'accreditationStore')
@observer
export default class Accreditation extends React.Component {
  componentWillMount() {
    this.props.accreditationStore.setAccreditationMethod('income');
  }
  handleMultiStepModalclose = () => {
    this.props.history.push('/app/profile-settings/investment-limits');
    const { INCOME_EVIDENCE_FORM, VERIFICATION_REQUEST_FORM } = this.props.accreditationStore;
    this.props.accreditationStore.resetAccreditation(VERIFICATION_REQUEST_FORM);
    this.props.accreditationStore.resetAccreditation(INCOME_EVIDENCE_FORM);
  }
  handleStepChange = (step) => {
    this.props.accreditationStore.setStepToBeRendered(step);
  }
  render() {
    const {
      INCOME_EVIDENCE_FORM,
      VERIFICATION_REQUEST_FORM,
      INCOME_UPLOAD_DOC_FORM,
    } = this.props.accreditationStore;
    const steps =
    [
      {
        name: 'Inc. evidence',
        component: <IncomeEvidence />,
        isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
      },
      {
        name: 'Verification',
        component: <Verification />,
        isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !INCOME_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
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
          setIsEnterPressed={setIsEnterPressed}
          isEnterPressed={isEnterPressed}
          resetEnterPressed={resetIsEnterPressed}
          inProgress={inProgress}
          formTitle="Verify your accreditation"
          handleMultiStepModalclose={this.handleMultiStepModalclose}
          setStepTobeRendered={this.handleStepChange}
        />
      </div>
    );
  }
}
