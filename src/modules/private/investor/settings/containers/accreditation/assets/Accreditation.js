import React from 'react';
import { inject, observer } from 'mobx-react';

import { MultiStep } from '../../../../../../../helper';
import NetWorth from './NetWorth';
import IncomeEvidence from '../shared/IncomeEvidence';
import Verification from '../shared/Verification';

@inject('uiStore', 'accreditationStore')
@observer
export default class Accreditation extends React.Component {
  componentWillMount() {
    this.props.accreditationStore.setAccreditationMethod('assets');
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
      NET_WORTH_FORM,
      INCOME_EVIDENCE_FORM,
      VERIFICATION_REQUEST_FORM,
      ASSETS_UPLOAD_DOC_FORM,
    } = this.props.accreditationStore;
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
        isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
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
          setStepTobeRendered={this.handleStepChange}
        />
      </div>
    );
  }
}