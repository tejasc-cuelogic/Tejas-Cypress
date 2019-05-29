import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import IncomeEvidence from './shared/IncomeEvidence';
import Verification from './shared/Verification';
import PopulateAccreditationSteps from './PopulateAccreditationSteps';

@inject('accreditationStore')
@withRouter
@observer
export default class VerifyEntityAccreditation extends React.Component {
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.getUserAccreditation().then(() => {
      this.props.accreditationStore.setFormData('ACCREDITATION_FORM', 'accreditation', accountType);
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
    if (step.formName === 'ENTITY_ACCREDITATION_FORM' && this.props.accreditationStore[step.formName].fields.method.value !== 'ASSETS') {
      this.props.accreditationStore.setFieldVal('accType', 'nonTrust');
      this.props.history.push(`${this.props.refLink}/falied`);
      return;
    }
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
    const formArray = [
      { key: 'ENTITY_ACCREDITATION_FORM' },
      { key: 'INCOME_EVIDENCE_FORM', component: <IncomeEvidence isEntity /> },
      {
        key: 'VERIFICATION',
        component: <Verification refLink={this.props.refLink} isEntity type={2} />,
      },
    ];
    return (
      <PopulateAccreditationSteps
        multiClickHandler={this.multiClickHandler}
        formArray={formArray}
      />
    );
  }
}
