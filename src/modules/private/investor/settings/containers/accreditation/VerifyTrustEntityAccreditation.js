import React from 'react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from './../../../../../../helper';
import NetWorth from './assets/NetWorth';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import AccreditationMethod from './shared/AccreditationMethod';
import TrustEntityAccreditationMethod from './shared/TrustEntityAccreditationMethod';

@inject('uiStore', 'accreditationStore')
@observer
export default class VerifyTrustEntityAccreditation extends React.Component {
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
      ACCREDITATION_FORM,
      INCOME_UPLOAD_DOC_FORM,
      TRUST_ENTITY_ACCREDITATION_FRM,
    } = this.props.accreditationStore;
    const steps = TRUST_ENTITY_ACCREDITATION_FRM.fields.trustEntityAccMethods.value === 'trustsAssets' ?
      [
        {
          name: '',
          component: <TrustEntityAccreditationMethod />,
          isHideLabel: true,
          isValid: TRUST_ENTITY_ACCREDITATION_FRM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 1,
        },
        {
          name: 'Net worth',
          component: <NetWorth />,
          isValid: NET_WORTH_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 2,
        },
        {
          name: 'Inc. evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 3,
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} />,
          isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
          isDirty: true,
          stepToBeRendered: 4,
        },
      ]
      : ACCREDITATION_FORM.fields.accreditationMethods.value === 'INCOME' ? [
        {
          name: '',
          component: <TrustEntityAccreditationMethod />,
          isHideLabel: true,
          isValid: TRUST_ENTITY_ACCREDITATION_FRM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 1,
        },
        {
          name: '',
          component: <AccreditationMethod />,
          isHideLabel: true,
          isValid: ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 2,
        },
        {
          name: 'Net worth',
          component: <NetWorth />,
          isValid: NET_WORTH_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 3,
        },
        {
          name: 'Inc. evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
          isDirty: true,
          stepToBeRendered: 4,
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} />,
          isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
          isDirty: true,
          stepToBeRendered: 5,
        },
      ]
        :
        [
          {
            name: '',
            component: <TrustEntityAccreditationMethod />,
            isValid: TRUST_ENTITY_ACCREDITATION_FRM.meta.isFieldValid ? '' : 'error',
            isDirty: true,
            stepToBeRendered: 1,
          },
          {
            name: '',
            component: <AccreditationMethod />,
            isValid: ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error',
            isDirty: true,
            stepToBeRendered: 2,
          },
          {
            name: 'Inc. evidence',
            component: <IncomeEvidence />,
            isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
            isDirty: true,
            stepToBeRendered: 3,
          },
          {
            name: 'Verification',
            component: <Verification refLink={this.props.refLink} />,
            isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !INCOME_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
            isDirty: true,
            stepToBeRendered: 4,
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
