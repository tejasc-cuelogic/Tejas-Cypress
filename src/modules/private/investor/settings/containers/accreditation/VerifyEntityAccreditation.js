import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { findIndex, map } from 'lodash';
import { MultiStep } from './../../../../../../helper';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import EntityAccreditationMethod from './shared/EntityAcceditationMethod';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class VerifyEntityAccreditation extends React.Component {
  state = { firstInit: '' };
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.setFormData('ACCREDITATION_FORM', 'accreditation', accountType);
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
    if (step.formName !== 'VERIFICATION_REQUEST_FORM' && step.formName !== 'INCOME_UPLOAD_DOC_FORM' && step.formName !== 'ASSETS_UPLOAD_DOC_FORM' && step.formName !== 'INCOME_EVIDENCE_FORM') {
      this.props.accreditationStore
        .updateAccreditation(step.formName, params.accountId, params.accountType.toUpperCase(), 2)
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
      INCOME_UPLOAD_DOC_FORM,
      ACCREDITATION_FORM,
      formValidCheck,
    } = this.props.accreditationStore;
    const steps =
      [
        {
          name: '',
          component: <EntityAccreditationMethod />,
          isHideLabel: true,
          isValid: ENTITY_ACCREDITATION_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !ENTITY_ACCREDITATION_FORM.meta.isValid,
          isDirty: true,
          stepToBeRendered: 1,
          formName: 'ENTITY_ACCREDITATION_FORM',
        },
        {
          name: 'Evidence',
          component: <IncomeEvidence isEntity />,
          isValid: INCOME_EVIDENCE_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !INCOME_EVIDENCE_FORM.meta.isValid,
          isDirty: true,
          stepToBeRendered: 2,
          formName: 'INCOME_EVIDENCE_FORM',
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} isEntity type={2} />,
          isValid: (INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid : ACCREDITATION_FORM.fields.method.value === 'INCOME' ? !INCOME_UPLOAD_DOC_FORM.meta.isValid : !ASSETS_UPLOAD_DOC_FORM.meta.isValid) ? 'error' : '',
          disableNxtBtn: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid :
            ACCREDITATION_FORM.fields.method.value === 'INCOME' ? !INCOME_UPLOAD_DOC_FORM.meta.isValid : !ASSETS_UPLOAD_DOC_FORM.meta.isValid,
          isDirty: true,
          formName: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? 'VERIFICATION_REQUEST_FORM' : ACCREDITATION_FORM.fields.method.value === 'INCOME' ? 'INCOME_UPLOAD_DOC_FORM' : 'ASSETS_UPLOAD_DOC_FORM',
          disableNextButton: true,
        },
      ];
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = this.props.uiStore;
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
