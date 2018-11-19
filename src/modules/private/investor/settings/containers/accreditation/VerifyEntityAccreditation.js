import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from './../../../../../../helper';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import EntityAccreditationMethod from './shared/EntityAcceditationMethod';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class VerifyEntityAccreditation extends React.Component {
  componentWillMount() {
    // this.props.accreditationStore.setStepToBeRendered(0);
    // this.props.accreditationStore.setAccreditationMethod('ASSETS');
  }
  handleMultiStepModalclose = () => {
    this.props.history.push('/app/profile-settings/investment-limits');
    const { INCOME_EVIDENCE_FORM, VERIFICATION_REQUEST_FORM } = this.props.accreditationStore;
    this.props.accreditationStore.resetAccreditation(VERIFICATION_REQUEST_FORM);
    this.props.accreditationStore.resetAccreditation(INCOME_EVIDENCE_FORM);
    this.props.accreditationStore.setStepToBeRendered(0);
  }
  handleStepChange = (step) => {
    this.props.accreditationStore.setStepToBeRendered(step);
  }
  multiClickHandler = (step) => {
    const { params } = this.props.match;
    if (step.formName !== 'VERIFICATION_REQUEST_FORM' && step.formName !== 'INCOME_UPLOAD_DOC_FORM' && step.formName !== 'ASSETS_UPLOAD_DOC_FORM' && step.formName !== 'INCOME_EVIDENCE_FORM') {
      this.props.accreditationStore
        .updateAccreditation(step.formName, params.accountId, params.accountType.toUpperCase())
        .then(() => {
          this.handleStepChange(step.stepToBeRendered);
        });
    } else {
      this.handleStepChange(step.stepToBeRendered);
    }
  }
  render() {
    const {
      INCOME_EVIDENCE_FORM,
      VERIFICATION_REQUEST_FORM,
      ASSETS_UPLOAD_DOC_FORM,
      ENTITY_ACCREDITATION_FORM,
    } = this.props.accreditationStore;
    const steps =
      [
        {
          name: '',
          component: <EntityAccreditationMethod />,
          isHideLabel: true,
          isValid: ENTITY_ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 1,
          formName: 'ENTITY_ACCREDITATION_FORM',
        },
        {
          name: 'Evidence',
          component: <IncomeEvidence isEntity />,
          isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 2,
          formName: 'INCOME_EVIDENCE_FORM',
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} isEntity />,
          isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
          isDirty: true,
          formName: 'VERIFICATION_REQUEST_FORM',
          disableNextButton: true,
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
          createAccount={this.multiClickHandler}
          steps={steps}
          formTitle="Verify your accreditation"
          setIsEnterPressed={setIsEnterPressed}
          isEnterPressed={isEnterPressed}
          resetEnterPressed={resetIsEnterPressed}
          inProgress={inProgress}
          handleMultiStepModalclose={this.handleMultiStepModalclose}
          setStepTobeRendered={this.handleStepChange}
          stepToBeRendered={this.props.accreditationStore.stepToBeRendered}
        />
      </div>
    );
  }
}
