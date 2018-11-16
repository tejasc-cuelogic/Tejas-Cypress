import React from 'react';
import { inject, observer } from 'mobx-react';
import { Loader, Dimmer } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from './../../../../../../helper';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import EntityAccreditationMethod from './shared/EntityAcceditationMethod';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class VerifyEntityAccreditation extends React.Component {
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
          stepToBeRendered: 3,
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
