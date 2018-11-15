import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from './../../../../../../helper';
import NetWorth from './assets/NetWorth';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import AccreditationMethod from './shared/AccreditationMethod';
// import Helper from '../../../../../../helper/utility';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class Accreditation extends React.Component {
  state = { submitLoading: false };
  componentWillMount() {
    this.props.accreditationStore.setStepToBeRendered(0);
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
    const { params } = this.props.match;
    if (step.formName !== 'VERIFICATION_REQUEST_FORM' || step.formName !== 'INCOME_UPLOAD_DOC_FORM' || step.formName !== 'ASSETS_UPLOAD_DOC_FORM') {
      this.props.accreditationStore
        .updateAccreditation(step.formName, params.accountId, params.accountType.toUpperCase())
        .then(() => {
          this.handleStepChange(step.stepToBeRendered);
          this.setState({ submitLoading: false });
        }).catch(() => {
          this.setState({ submitLoading: false });
        });
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
    } = this.props.accreditationStore;
    const steps = ACCREDITATION_FORM.fields.method.value === 'ASSETS' ?
      [
        {
          name: '',
          component: <AccreditationMethod />,
          isValid: ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error',
          isHideLabel: true,
          formName: 'ACCREDITATION_FORM',
          isDirty: true,
          stepToBeRendered: 1,
        },
        {
          name: 'Net worth',
          component: <NetWorth />,
          isValid: NET_WORTH_FORM.meta.isFieldValid ? '' : 'error',
          formName: 'NET_WORTH_FORM',
          isDirty: true,
          stepToBeRendered: 2,
        },
        {
          name: 'Inc. evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
          formName: 'INCOME_EVIDENCE_FORM',
          stepToBeRendered: 3,
        },
        {
          name: 'Verification',
          component: <Verification params={this.props.match.params} />,
          isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !ASSETS_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
          formName: 'VERIFICATION_REQUEST_FORM',
          isDirty: true,
        },
      ]
      :
      [
        {
          name: '',
          component: <AccreditationMethod />,
          isValid: ACCREDITATION_FORM.meta.isFieldValid ? '' : 'error',
          isHideLabel: true,
          formName: 'ACCREDITATION_FORM',
          isDirty: true,
          stepToBeRendered: 1,
        },
        {
          name: 'Inc. evidence',
          component: <IncomeEvidence />,
          isValid: INCOME_EVIDENCE_FORM.meta.isFieldValid ? '' : 'error',
          formName: 'INCOME_EVIDENCE_FORM',
          stepToBeRendered: 2,
        },
        {
          name: 'Verification',
          component: <Verification params={this.props.match.params} />,
          isValid: !VERIFICATION_REQUEST_FORM.meta.isFieldValid || !INCOME_UPLOAD_DOC_FORM.meta.isFieldValid ? 'error' : '',
          formName: 'VERIFICATION_REQUEST_FORM',
          isDirty: true,
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
