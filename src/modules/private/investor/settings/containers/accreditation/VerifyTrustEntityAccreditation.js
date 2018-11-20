import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { findIndex, map } from 'lodash';
import { MultiStep } from './../../../../../../helper';
import NetWorth from './assets/NetWorth';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import AccreditationMethod from './shared/AccreditationMethod';
import TrustEntityAccreditationMethod from './shared/TrustEntityAccreditationMethod';
import { ENTITY_TRUST_NET_WORTH } from './../../../../../../services/constants/investmentLimit';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class VerifyTrustEntityAccreditation extends React.Component {
  state = { firstInit: '' };
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.setFormData('TRUST_ENTITY_ACCREDITATION_FRM', 'accreditation', accountType);
    this.props.accreditationStore.setFormData('ACCREDITATION_FORM', 'accreditation', accountType);
    this.props.accreditationStore.changeFormObject('NET_WORTH_FORM', ENTITY_TRUST_NET_WORTH);
    this.props.accreditationStore.setFormData('NET_WORTH_FORM', 'accreditation', accountType);
    this.props.accreditationStore.setFormData('INCOME_EVIDENCE_FORM', 'accreditation', accountType);
    this.props.accreditationStore.setFormData('VERIFICATION_REQUEST_FORM', 'accreditation', accountType);
    this.props.accreditationStore.setFormData('INCOME_UPLOAD_DOC_FORM', 'accreditation', accountType);
    this.props.accreditationStore.setFormData('ASSETS_UPLOAD_DOC_FORM', 'accreditation', accountType);
    if (this.state.firstInit === '') {
      this.setState({ firstInit: true });
    }
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
    if ((step.formName === 'TRUST_ENTITY_ACCREDITATION_FRM' && this.props.accreditationStore.TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === 'ASSETS') || (step.formName !== 'TRUST_ENTITY_ACCREDITATION_FRM' && step.formName !== 'VERIFICATION_REQUEST_FORM' && step.formName !== 'INCOME_UPLOAD_DOC_FORM' && step.formName !== 'ASSETS_UPLOAD_DOC_FORM' && step.formName !== 'INCOME_EVIDENCE_FORM')) {
      this.props.accreditationStore
        .updateAccreditation(step.formName, params.accountId, params.accountType.toUpperCase(), 3)
        .then(() => {
          this.handleStepChange(step.stepToBeRendered);
        });
    } else {
      this.handleStepChange(step.stepToBeRendered);
    }
  }
  handleFormTitle = () => {
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
      formValidCheck,
    } = this.props.accreditationStore;
    const steps = TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === 'ASSETS' ?
      [
        {
          name: '',
          component: <TrustEntityAccreditationMethod />,
          isHideLabel: true,
          disableNxtBtn: !TRUST_ENTITY_ACCREDITATION_FRM.meta.isValid,
          isDirty: true,
          stepToBeRendered: 1,
          formName: 'TRUST_ENTITY_ACCREDITATION_FRM',
        },
        {
          name: 'Net worth',
          component: <NetWorth isTrust />,
          isValid: NET_WORTH_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !NET_WORTH_FORM.meta.isValid,
          isDirty: true,
          stepToBeRendered: 2,
          formName: 'NET_WORTH_FORM',
        },
        {
          name: 'Evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !INCOME_EVIDENCE_FORM.meta.isValid,
          stepToBeRendered: 3,
          isDirty: true,
          formName: 'INCOME_EVIDENCE_FORM',
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} type={3} />,
          isValid: (INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid : !ASSETS_UPLOAD_DOC_FORM.meta.isValid) ? 'error' : '',
          disableNxtBtn: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid :
            !ASSETS_UPLOAD_DOC_FORM.meta.isValid,
          isDirty: true,
          formName: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? 'VERIFICATION_REQUEST_FORM' : 'ASSETS_UPLOAD_DOC_FORM',
          disableNextButton: true,
        },
      ]
      : ACCREDITATION_FORM.fields.method.value === 'REVOCABLE_TRUST_INCOME' ? [
        {
          name: '',
          component: <TrustEntityAccreditationMethod />,
          isHideLabel: true,
          disableNxtBtn: !TRUST_ENTITY_ACCREDITATION_FRM.meta.isValid,
          isDirty: true,
          stepToBeRendered: 1,
          formName: 'TRUST_ENTITY_ACCREDITATION_FRM',
        },
        {
          name: '',
          component: <AccreditationMethod isTrust />,
          isHideLabel: true,
          isValid: ACCREDITATION_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !ACCREDITATION_FORM.meta.isValid,
          isDirty: true,
          stepToBeRendered: 2,
          formName: 'ACCREDITATION_FORM',
        },
        {
          name: 'Net worth',
          component: <NetWorth />,
          isValid: NET_WORTH_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !NET_WORTH_FORM.meta.isValid,
          isDirty: true,
          stepToBeRendered: 3,
          formName: 'NET_WORTH_FORM',
        },
        {
          name: 'Evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !INCOME_EVIDENCE_FORM.meta.isValid,
          stepToBeRendered: 4,
          isDirty: true,
          formName: 'INCOME_EVIDENCE_FORM',
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} type={3} />,
          isValid: (INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid : !ASSETS_UPLOAD_DOC_FORM.meta.isValid) ? 'error' : '',
          disableNxtBtn: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid :
            !INCOME_UPLOAD_DOC_FORM.meta.isValid,
          isDirty: true,
          formName: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? 'VERIFICATION_REQUEST_FORM' : 'INCOME_UPLOAD_DOC_FORM',
          disableNextButton: true,
        },
      ]
        :
        [
          {
            name: '',
            component: <TrustEntityAccreditationMethod />,
            isHideLabel: true,
            disableNxtBtn: !TRUST_ENTITY_ACCREDITATION_FRM.meta.isValid,
            isDirty: true,
            stepToBeRendered: 1,
            formName: 'TRUST_ENTITY_ACCREDITATION_FRM',
          },
          {
            name: '',
            component: <AccreditationMethod isTrust />,
            isHideLabel: true,
            disableNxtBtn: !ACCREDITATION_FORM.meta.isValid,
            isDirty: true,
            stepToBeRendered: 2,
            formName: 'ACCREDITATION_FORM',
          },
          {
            name: 'Evidence',
            component: <IncomeEvidence />,
            isValid: INCOME_EVIDENCE_FORM.meta.isValid ? '' : 'error',
            disableNxtBtn: !INCOME_EVIDENCE_FORM.meta.isValid,
            stepToBeRendered: 3,
            isDirty: true,
            formName: 'INCOME_EVIDENCE_FORM',
          },
          {
            name: 'Verification',
            component: <Verification refLink={this.props.refLink} type={3} />,
            isValid: (INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid : !ASSETS_UPLOAD_DOC_FORM.meta.isValid) ? 'error' : '',
            disableNxtBtn: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid :
              !ASSETS_UPLOAD_DOC_FORM.meta.isValid,
            formName: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? 'VERIFICATION_REQUEST_FORM' : 'ASSETS_UPLOAD_DOC_FORM',
            stepToBeRendered: 4,
            disableNextButton: true,
          },
        ];
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = this.props.uiStore;
    const formTitle = this.handleFormTitle();
    if (this.state.firstInit) {
      const forms = map(steps, step => step.formName);
      const invalidForms = formValidCheck(forms);
      if (invalidForms && invalidForms.length) {
        const index = findIndex(steps, step => step.formName === invalidForms[0]);
        this.handleStepChange(index);
      }
      this.setState({ firstInit: false });
    }
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
