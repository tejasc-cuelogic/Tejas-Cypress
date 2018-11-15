import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Loader, Dimmer } from 'semantic-ui-react';
import { MultiStep } from './../../../../../../helper';
import NetWorth from './assets/NetWorth';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import AccreditationMethod from './shared/AccreditationMethod';
import TrustEntityAccreditationMethod from './shared/TrustEntityAccreditationMethod';

@inject('uiStore', 'accreditationStore')
@observer
@withRouter
export default class VerifyTrustEntityAccreditation extends React.Component {
  state = { submitLoading: false };
  componentWillMount() {
    // this.props.accreditationStore.setStepToBeRendered(0);
    this.props.accreditationStore.setAccreditationMethod('ASSETS');
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
  multiClickHandler = (step) => {
    this.handleStepChange(step.stepToBeRendered);
    // const { params } = this.props.match;
    // this.props.accreditationStore
    //   .updateAccreditation(step.formName, params.accountId, params.accountType.toUpperCase())
    //   .then(() => {
    //     this.setState({ submitLoading: false });
    //   }).catch(() => {
    //     this.setState({ submitLoading: false });
    //   });
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
          // isDirty: true,
          stepToBeRendered: 1,
          formName: 'TRUST_ENTITY_ACCREDITATION_FRM',
        },
        {
          name: 'Net worth',
          component: <NetWorth />,
          isValid: NET_WORTH_FORM.meta.isFieldValid ? '' : 'error',
          // isDirty: true,
          stepToBeRendered: 2,
          formName: 'NET_WORTH_FORM',
        },
        {
          name: 'Inc. evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
          // isDirty: true,
          stepToBeRendered: 3,
          formName: 'INCOME_EVIDENCE_FORM',
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} />,
          isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
          // isDirty: true,
          stepToBeRendered: 4,
          formName: 'VERIFICATION_REQUEST_FORM',
        },
      ]
      : ACCREDITATION_FORM.fields.method.value === 'INCOME' ? [
        {
          name: '',
          component: <TrustEntityAccreditationMethod />,
          isHideLabel: true,
          isValid: TRUST_ENTITY_ACCREDITATION_FRM.meta.isFieldValid ? '' : 'error',
          // isDirty: true,
          stepToBeRendered: 1,
          formName: 'TRUST_ENTITY_ACCREDITATION_FRM',
        },
        {
          name: '',
          component: <AccreditationMethod />,
          isHideLabel: true,
          isValid: ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error',
          // isDirty: true,
          stepToBeRendered: 2,
          formName: 'ACCREDITATION_FORM',
        },
        {
          name: 'Net worth',
          component: <NetWorth />,
          isValid: NET_WORTH_FORM.meta.isFieldValid ? '' : 'error',
          // isDirty: true,
          stepToBeRendered: 3,
          formName: 'NET_WORTH_FORM',
        },
        {
          name: 'Inc. evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
          // isDirty: true,
          stepToBeRendered: 4,
          formName: 'INCOME_EVIDENCE_FORM',
        },
        {
          name: 'Verification',
          component: <Verification refLink={this.props.refLink} />,
          isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
          // isDirty: true,
          stepToBeRendered: 5,
          formName: 'VERIFICATION_REQUEST_FORM',
        },
      ]
        :
        [
          {
            name: '',
            component: <TrustEntityAccreditationMethod />,
            isHideLabel: true,
            isValid: TRUST_ENTITY_ACCREDITATION_FRM.meta.isFieldValid ? '' : 'error',
            // isDirty: true,
            stepToBeRendered: 1,
            formName: 'ACCREDITATION_FORM',
          },
          {
            name: '',
            component: <AccreditationMethod />,
            isHideLabel: true,
            isValid: ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error',
            // isDirty: true,
            stepToBeRendered: 2,
            formName: 'ACCREDITATION_FORM',
          },
          {
            name: 'Inc. evidence',
            component: <IncomeEvidence />,
            isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
            // isDirty: true,
            stepToBeRendered: 3,
            formName: 'ACCREDITATION_FORM',
          },
          {
            name: 'Verification',
            component: <Verification refLink={this.props.refLink} />,
            isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !INCOME_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
            // isDirty: true,
            stepToBeRendered: 4,
            formName: 'ACCREDITATION_FORM',
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
        {!this.state.submitLoading ?
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
          /> :
          <Dimmer active>
            <Loader>
              Please wait...<br /><br />
              We are generating your agreement. This can take up to a minute.
            </Loader>
          </Dimmer>
        }
      </div>
    );
  }
}
