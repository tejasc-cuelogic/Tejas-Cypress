import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from './../../../../../../helper';
import NetWorth from './assets/NetWorth';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import AccreditationMethod from './shared/AccreditationMethod';
import TrustEntityAccreditationMethod from './shared/TrustEntityAccreditationMethod';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class VerifyTrustEntityAccreditation extends React.Component {
  componentWillMount() {
    // this.props.accreditationStore.setStepToBeRendered(0);
    // this.props.accreditationStore.setAccreditationMethod('ACCREDITATION_FORM', 'ASSETS');
    // this.props.accreditationStore.setAccreditationMethod
    // ('TRUST_ENTITY_ACCREDITATION_FRM', 'ASSETS');
  }
  handleMultiStepModalclose = () => {
    this.props.history.push('/app/profile-settings/investment-limits');
    this.props.accreditationStore.resetAllForms();
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
  handleformTitle = () => {
    if (this.props.accreditationStore.stepToBeRendered === '' || this.props.accreditationStore.stepToBeRendered === 0) {
      return 'How is your trust accreditated?';
    } else if (this.props.accreditationStore.stepToBeRendered === 1 && this.props.accreditationStore.TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === 'ASSETS') {
      return 'What is your trust net worth??';
    }
    return 'Verify your accreditation';
  }
  render() {
    const {
      NET_WORTH_FORM,
      INCOME_EVIDENCE_FORM,
      VERIFICATION_REQUEST_FORM,
      ASSETS_UPLOAD_DOC_FORM,
      ACCREDITATION_FORM,
      INCOME_UPLOAD_DOC_FORM,
      TRUST_ENTITY_ACCREDITATION_FRM,
    } = this.props.accreditationStore;
    const steps = TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === 'ASSETS' ?
      [
        {
          name: '',
          component: <TrustEntityAccreditationMethod />,
          isHideLabel: true,
          isValid: TRUST_ENTITY_ACCREDITATION_FRM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 1,
          formName: 'TRUST_ENTITY_ACCREDITATION_FRM',
        },
        {
          name: 'Net worth',
          component: <NetWorth isTrust />,
          isValid: NET_WORTH_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 2,
          formName: 'NET_WORTH_FORM',
        },
        {
          name: 'Evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
          stepToBeRendered: 3,
          isDirty: true,
          formName: 'INCOME_EVIDENCE_FORM',
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} />,
          isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
          isDirty: true,
          stepToBeRendered: 4,
          formName: 'VERIFICATION_REQUEST_FORM',
          disableNextButton: true,
        },
      ]
      : ACCREDITATION_FORM.fields.method.value === 'INCOME' ? [
        {
          name: '',
          component: <TrustEntityAccreditationMethod />,
          isHideLabel: true,
          isValid: TRUST_ENTITY_ACCREDITATION_FRM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 1,
          formName: 'TRUST_ENTITY_ACCREDITATION_FRM',
        },
        {
          name: '',
          component: <AccreditationMethod isTrust />,
          isHideLabel: true,
          isValid: ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 2,
          formName: 'ACCREDITATION_FORM',
        },
        {
          name: 'Net worth',
          component: <NetWorth />,
          isValid: NET_WORTH_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 3,
          formName: 'NET_WORTH_FORM',
        },
        {
          name: 'Evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
          stepToBeRendered: 4,
          isDirty: true,
          formName: 'INCOME_EVIDENCE_FORM',
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} />,
          isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
          isDirty: true,
          stepToBeRendered: 5,
          formName: 'VERIFICATION_REQUEST_FORM',
          disableNextButton: true,
        },
      ]
        :
        [
          {
            name: '',
            component: <TrustEntityAccreditationMethod />,
            isHideLabel: true,
            isValid: TRUST_ENTITY_ACCREDITATION_FRM.meta.isFieldValid ? '' : 'error',
            isDirty: true,
            stepToBeRendered: 1,
            formName: 'TRUST_ENTITY_ACCREDITATION_FRM',
          },
          {
            name: '',
            component: <AccreditationMethod isTrust />,
            isHideLabel: true,
            isValid: ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error',
            isDirty: true,
            stepToBeRendered: 2,
            formName: 'ACCREDITATION_FORM',
          },
          {
            name: 'Evidence',
            component: <IncomeEvidence />,
            isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
            stepToBeRendered: 3,
            isDirty: true,
            formName: 'INCOME_EVIDENCE_FORM',
          },
          {
            name: 'Verification',
            component: <Verification refLink={this.props.refLink} />,
            isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !INCOME_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
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
    const formTitle = this.handleformTitle();
    return (
      <div className="step-progress">
        <MultiStep
          createAccount={this.multiClickHandler}
          steps={steps}
          formTitle={formTitle}
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
