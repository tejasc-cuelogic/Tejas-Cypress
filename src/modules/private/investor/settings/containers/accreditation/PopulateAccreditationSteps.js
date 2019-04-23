import React from 'react';
import { findIndex, map } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from '../../../../../../helper';
import NetWorth from './assets/NetWorth';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import IncomeQualCheck from './shared/IncomeQualCheck';
import NetWorthCheck from './shared/NetWorthQualCheck';
import FillingStatus from './shared/FillingStatus';
import EntityAccreditationMethod from './shared/EntityAcceditationMethod';
import TrustEntityAccreditationMethod from './shared/TrustEntityAccreditationMethod';

const StepsMetaData = {
  ACCREDITATION_FORM: {
    name: '',
    component: <IncomeQualCheck />,
    isHideLabel: true,
    formName: 'ACCREDITATION_FORM',
    isDirty: true,
  },
  NETWORTH_QAL_FORM: {
    name: 'Net worth',
    component: <NetWorthCheck />,
    formName: 'NETWORTH_QAL_FORM',
    isDirty: true,
  },
  FILLING_STATUS_FORM: {
    name: '',
    component: <FillingStatus />,
    formName: 'FILLING_STATUS_FORM',
    isDirty: true,
    isValid: true,
  },
  NET_WORTH_FORM: {
    name: 'Net worth',
    component: <NetWorth />,
    formName: 'NET_WORTH_FORM',
    isDirty: true,
  },
  INCOME_EVIDENCE_FORM: {
    name: 'Evidence',
    component: <IncomeEvidence />,
    formName: 'INCOME_EVIDENCE_FORM',
    isDirty: true,
  },
  VERIFICATION: {
    name: 'Verification',
    component: <Verification />,
    isDirty: true,
  },
  ENTITY_ACCREDITATION_FORM: {
    name: '',
    component: <EntityAccreditationMethod />,
    isHideLabel: true,
    isDirty: true,
    formName: 'ENTITY_ACCREDITATION_FORM',
  },
  TRUST_ENTITY_ACCREDITATION_FRM: {
    name: '',
    component: <TrustEntityAccreditationMethod />,
    isHideLabel: true,
    isDirty: true,
    formName: 'TRUST_ENTITY_ACCREDITATION_FRM',
  },
};

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class PopulateAccreditationSteps extends React.Component {
  componentWillMount() {
    // if (this.props.accreditationStore.firstInit === '') {
    //   this.props.accreditationStore.setFieldVal('firstInit', true);
    // }
  }
  handleMultiStepModalclose = () => {
    this.props.history.push('/app/profile-settings/investment-limits');
    this.props.accreditationStore.resetAllForms();
    this.props.accreditationStore.setFieldVal('firstInit', '');
  }
  handleStepChange = (step) => {
    this.props.accreditationStore.setStepToBeRendered(step);
  }
  populateSteps = () => {
    const { formArray, accreditationStore } = this.props;
    const steps = map(formArray, (form, index) => {
      const formObj = {
        ...StepsMetaData[form.key],
        isHideLabel: StepsMetaData[form.key].isHideLabel || false,
      };
      formObj.stepToBeRendered = index + 1;
      if (form.component) {
        formObj.component = form.component;
      }
      if (form.key === 'VERIFICATION') {
        formObj.isValid = (accreditationStore.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !accreditationStore.VERIFICATION_REQUEST_FORM.meta.isFieldValid : accreditationStore.ACCREDITATION_FORM.fields.method.value === 'INCOME' ? !accreditationStore.INCOME_UPLOAD_DOC_FORM.meta.isFieldValid : !accreditationStore.ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid) ? 'error' : '';
        formObj.disableNxtBtn = accreditationStore.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? !accreditationStore.VERIFICATION_REQUEST_FORM.meta.isValid :
          accreditationStore.ACCREDITATION_FORM.fields.method.value === 'INCOME' ? !accreditationStore.INCOME_UPLOAD_DOC_FORM.meta.isValid : !accreditationStore.ASSETS_UPLOAD_DOC_FORM.meta.isValid;
        formObj.formName = accreditationStore.INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ? 'VERIFICATION_REQUEST_FORM' : (accreditationStore.ACCREDITATION_FORM.fields.method.value === 'INCOME' || accreditationStore.ACCREDITATION_FORM.fields.method.value === 'REVOCABLE_TRUST_INCOME') ? 'INCOME_UPLOAD_DOC_FORM' : 'ASSETS_UPLOAD_DOC_FORM';
      } else if (form.key === 'ENTITY_ACCREDITATION_FORM') {
        formObj.isValid = accreditationStore.ENTITY_ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error';
        formObj.disableNxtBtn = !accreditationStore.ENTITY_ACCREDITATION_FORM.meta.isValid;
      } else {
        formObj.isValid = accreditationStore[form.key].meta.isFieldValid ? '' : 'error';
        formObj.disableNxtBtn = !accreditationStore[form.key].meta.isValid;
      }
      if (index === (formArray.length - 1) && !form.enableNextBtn) {
        formObj.disableNextButton = true;
      }
      return formObj;
    });
    return steps;
  }
  render() {
    const {
      formValidCheck, showLoader,
    } = this.props.accreditationStore;
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = this.props.uiStore;
    const steps = this.populateSteps();
    if (this.props.accreditationStore.firstInit) {
      const forms = map(steps, step => step.formName);
      const invalidForms = formValidCheck(forms);
      if (invalidForms && invalidForms.length) {
        const index = findIndex(steps, step => step.formName === invalidForms[0]);
        this.handleStepChange(index);
      }
      this.props.accreditationStore.setFieldVal('firstInit', false);
    }
    return (
      <div className="step-progress">
        <MultiStep
          createAccount={this.props.multiClickHandler}
          steps={steps}
          formTitle="Verify your status"
          setIsEnterPressed={setIsEnterPressed}
          isEnterPressed={isEnterPressed}
          resetEnterPressed={resetIsEnterPressed}
          inProgress={inProgress || showLoader}
          handleMultiStepModalclose={this.handleMultiStepModalclose}
          setStepTobeRendered={this.handleStepChange}
          stepToBeRendered={this.props.accreditationStore.stepToBeRendered}
          formHeaderClick
        />
      </div>
    );
  }
}
