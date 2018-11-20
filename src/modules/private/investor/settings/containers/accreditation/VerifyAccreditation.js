import React from 'react';
import { findIndex, map } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from './../../../../../../helper';
import NetWorth from './assets/NetWorth';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import AccreditationMethod from './shared/AccreditationMethod';
import { NET_WORTH } from './../../../../../../services/constants/investmentLimit';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class Accreditation extends React.Component {
  state = { firstInit: '' };
  componentWillMount() {
    const { accreditationStore, match } = this.props;
    const { accountType } = match.params;
    const { setFormData, changeFormObject } = accreditationStore;
    setFormData('ACCREDITATION_FORM', 'accreditation', accountType);
    changeFormObject('NET_WORTH_FORM', NET_WORTH);
    setFormData('NET_WORTH_FORM', 'accreditation', accountType);
    setFormData('INCOME_EVIDENCE_FORM', 'accreditation', accountType);
    setFormData('VERIFICATION_REQUEST_FORM', 'accreditation', accountType);
    setFormData('INCOME_UPLOAD_DOC_FORM', 'accreditation', accountType);
    setFormData('ASSETS_UPLOAD_DOC_FORM', 'accreditation', accountType);
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
        .updateAccreditation(step.formName, params.accountId, params.accountType.toUpperCase(), 1)
        .then(() => {
          this.handleStepChange(step.stepToBeRendered);
        });
    } else {
      this.handleStepChange(step.stepToBeRendered);
    }
  }
  render() {
    const {
      NET_WORTH_FORM,
      INCOME_EVIDENCE_FORM,
      VERIFICATION_REQUEST_FORM,
      ASSETS_UPLOAD_DOC_FORM,
      ACCREDITATION_FORM,
      INCOME_UPLOAD_DOC_FORM,
      formValidCheck,
    } = this.props.accreditationStore;
    const steps = ACCREDITATION_FORM.fields.method.value === 'ASSETS' ?
      [
        {
          name: '',
          component: <AccreditationMethod />,
          isHideLabel: true,
          disableNxtBtn: !ACCREDITATION_FORM.meta.isValid,
          formName: 'ACCREDITATION_FORM',
          isDirty: true,
          stepToBeRendered: 1,
        },
        {
          name: 'Net worth',
          component: <NetWorth />,
          isValid: NET_WORTH_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !NET_WORTH_FORM.meta.isValid,
          formName: 'NET_WORTH_FORM',
          isDirty: true,
          stepToBeRendered: 2,
        },
        {
          name: 'Evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !INCOME_EVIDENCE_FORM.meta.isValid,
          formName: 'INCOME_EVIDENCE_FORM',
          isDirty: true,
          stepToBeRendered: 3,
        },
        {
          name: 'Verification',
          component: <Verification step={3} refLink={this.props.refLink} type={1} />,
          isValid: (INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid : !ASSETS_UPLOAD_DOC_FORM.meta.isValid) ? 'error' : '',
          disableNxtBtn: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid :
            !ASSETS_UPLOAD_DOC_FORM.meta.isValid,
          formName: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? 'VERIFICATION_REQUEST_FORM' : 'ASSETS_UPLOAD_DOC_FORM',
          isDirty: true,
          disableNextButton: true,
        },
      ]
      :
      [
        {
          name: '',
          component: <AccreditationMethod />,
          isHideLabel: true,
          disableNxtBtn: !ACCREDITATION_FORM.meta.isValid,
          formName: 'ACCREDITATION_FORM',
          isDirty: true,
          stepToBeRendered: 1,
        },
        {
          name: 'Evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isValid ? '' : 'error',
          disableNxtBtn: !INCOME_EVIDENCE_FORM.meta.isValid,
          formName: 'INCOME_EVIDENCE_FORM',
          isDirty: true,
          stepToBeRendered: 2,
        },
        {
          name: 'Verification',
          component: <Verification step={2} refLink={this.props.refLink} type={1} />,
          disableNxtBtn: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid :
            !INCOME_UPLOAD_DOC_FORM.meta.isValid,
          isValid: (INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !VERIFICATION_REQUEST_FORM.meta.isValid : !INCOME_UPLOAD_DOC_FORM.meta.isValid) ? 'error' : '',
          formName: INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? 'VERIFICATION_REQUEST_FORM' : 'INCOME_UPLOAD_DOC_FORM',
          isDirty: true,
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
