import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import NetWorth from './assets/NetWorth';
import Verification from './shared/Verification';
import IncomeEvidence from './shared/IncomeEvidence';
import AccreditationMethod from './shared/AccreditationMethod';
import { ENTITY_TRUST_NET_WORTH, ACCREDITATION_METHODS_ENTITY } from './../../../../../../services/constants/investmentLimit';
import PopulateAccreditationSteps from './PopulateAccreditationSteps';

@inject('accreditationStore')
@withRouter
@observer
export default class VerifyTrustEntityAccreditation extends React.Component {
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.getUserAccreditation().then(() => {
      this.props.accreditationStore.changeFormObject('ACCREDITATION_FORM', ACCREDITATION_METHODS_ENTITY);
      this.props.accreditationStore.setFormData('TRUST_ENTITY_ACCREDITATION_FRM', 'accreditation', accountType);
      this.props.accreditationStore.changeFormObject('NET_WORTH_FORM', ENTITY_TRUST_NET_WORTH);
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
      ACCREDITATION_FORM,
      TRUST_ENTITY_ACCREDITATION_FRM,
    } = this.props.accreditationStore;
    const formArray = TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === 'ASSETS' ?
      [
        { key: 'TRUST_ENTITY_ACCREDITATION_FRM' },
        { key: 'NET_WORTH_FORM', component: <NetWorth isTrust /> },
        { key: 'INCOME_EVIDENCE_FORM', component: <IncomeEvidence isTrust /> },
        {
          key: 'VERIFICATION',
          component: <Verification refLink={this.props.refLink} type={3} />,
        },
      ]
      : ACCREDITATION_FORM.fields.method.value === 'REVOCABLE_TRUST_ASSETS' ? [
        { key: 'TRUST_ENTITY_ACCREDITATION_FRM' },
        { key: 'ACCREDITATION_FORM', component: <AccreditationMethod isTrust /> },
        { key: 'NET_WORTH_FORM', component: <NetWorth isTrust /> },
        { key: 'INCOME_EVIDENCE_FORM' },
        {
          key: 'VERIFICATION',
          component: <Verification refLink={this.props.refLink} type={3} />,
        },
      ]
        :
        [
          { key: 'TRUST_ENTITY_ACCREDITATION_FRM' },
          { key: 'ACCREDITATION_FORM', component: <AccreditationMethod isTrust /> },
          { key: 'INCOME_EVIDENCE_FORM' },
          {
            key: 'VERIFICATION',
            component: <Verification refLink={this.props.refLink} type={3} />,
          },
        ];
    const formTitle = this.handleFormTitle();
    return (
      <PopulateAccreditationSteps
        multiClickHandler={this.multiClickHandler}
        formArray={formArray}
        formTitle={formTitle}
      />
    );
  }
}
