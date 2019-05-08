import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Verification from './shared/Verification';
import IncomeEvidence from './shared/IncomeEvidence';
import PopulateAccreditationSteps from './PopulateAccreditationSteps';

@inject('accreditationStore')
@withRouter
@observer
export default class VerifyTrustEntityAccreditation extends React.Component {
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.getUserAccreditation().then(() => {
      this.props.accreditationStore.setFormData('TRUST_ENTITY_ACCREDITATION_FRM', 'accreditation', accountType);
      this.props.accreditationStore.setFormData('NET_WORTH_FORM', 'accreditation', accountType);
      this.props.accreditationStore.setFormData('INCOME_EVIDENCE_FORM', 'accreditation', accountType);
      this.props.accreditationStore.setFormData('VERIFICATION_REQUEST_FORM', 'accreditation', accountType);
      this.props.accreditationStore.setFormData('INCOME_UPLOAD_DOC_FORM', 'accreditation', accountType);
      this.props.accreditationStore.setFormData('ASSETS_UPLOAD_DOC_FORM', 'accreditation', accountType);
      if (this.props.accreditationStore.firstInit === '') {
        this.props.accreditationStore.setFieldVal('firstInit', true);
      }
    });
  }
  handleStepChange = (step) => {
    this.props.accreditationStore.setStepToBeRendered(step);
  }
  multiClickHandler = (step) => {
    const { params } = this.props.match;
    if (step.formName === 'TRUST_ENTITY_ACCREDITATION_FRM' && this.props.accreditationStore[step.formName].fields.method.value !== 'ASSETS') {
      this.props.accreditationStore.setFieldVal('accType', 'trust');
      this.props.history.push(`${this.props.refLink}/falied`);
      return;
    }
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
  render() {
    const formArray = [
      { key: 'TRUST_ENTITY_ACCREDITATION_FRM' },
      { key: 'INCOME_EVIDENCE_FORM', component: <IncomeEvidence isTrust /> },
      {
        key: 'VERIFICATION',
        component: <Verification isEntity refLink={this.props.refLink} type={3} />,
      },
    ];
    return (
      <PopulateAccreditationSteps
        multiClickHandler={this.multiClickHandler}
        formArray={formArray}
        formTitle="Verify your status"
      />
    );
  }
}
