import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Verification from './shared/Verification';
import PopulateAccreditationSteps from './PopulateAccreditationSteps';
import { NET_WORTH, INCOME_QAL } from './../../../../../../services/constants/investmentLimit';

@inject('accreditationStore')
@withRouter
@observer
export default class Accreditation extends React.Component {
  componentWillMount() {
    const { match } = this.props;
    const { accountType } = match.params;
    this.props.accreditationStore.setFieldVal('docsToUpload', []);
    this.props.accreditationStore.getUserAccreditation().then(() => {
      this.props.accreditationStore.changeFormObject('ACCREDITATION_FORM', INCOME_QAL);
      this.props.accreditationStore.setFormData('ACCREDITATION_FORM', 'accreditation', accountType);
      this.props.accreditationStore.changeFormObject('NET_WORTH_FORM', NET_WORTH);
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
  componentWillUpdate() {
    this.props.accreditationStore.setFieldVal('docsToUpload', []);
  }
  handleStepChange = (step) => {
    this.props.accreditationStore.setStepToBeRendered(step);
  }
  multiClickHandler = (step) => {
    const { params } = this.props.match;
    if (step.formName === 'NETWORTH_QAL_FORM' && this.props.accreditationStore[step.formName].fields.method.value === 'NONETWORTH') {
      this.props.history.push(`${this.props.refLink}/falied`);
      return;
    }
    if (!(step.formName === 'ACCREDITATION_FORM' && this.props.accreditationStore[step.formName].fields.method.value === 'ASSETS') && step.formName !== 'FILLING_STATUS_FORM' && !(step.formName === 'NETWORTH_QAL_FORM' && this.props.accreditationStore[step.formName].fields.method.value === 'NONETWORTH') && step.formName !== 'VERIFICATION_REQUEST_FORM' && step.formName !== 'INCOME_UPLOAD_DOC_FORM' && step.formName !== 'ASSETS_UPLOAD_DOC_FORM' && step.formName !== 'INCOME_EVIDENCE_FORM') {
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
      ACCREDITATION_FORM,
      INCOME_EVIDENCE_FORM,
      NETWORTH_QAL_FORM,
    } = this.props.accreditationStore;
    const formArray = (ACCREDITATION_FORM.fields.method.value === 'INCOME' && INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'uploaddocument') ? [
      { key: 'ACCREDITATION_FORM' },
      { key: 'INCOME_EVIDENCE_FORM' },
      { key: 'FILLING_STATUS_FORM' },
      {
        key: 'VERIFICATION',
        component: <Verification step={3} refLink={this.props.refLink} type={1} />,
      },
    ] : ACCREDITATION_FORM.fields.method.value === 'INCOME' ?
      [
        { key: 'ACCREDITATION_FORM' },
        { key: 'INCOME_EVIDENCE_FORM' },
        {
          key: 'VERIFICATION',
          component: <Verification step={2} refLink={this.props.refLink} type={1} />,
        },
      ]
      : NETWORTH_QAL_FORM.fields.method.value === 'ASSETS' ? [
        { key: 'ACCREDITATION_FORM' },
        { key: 'NETWORTH_QAL_FORM' },
        { key: 'INCOME_EVIDENCE_FORM' },
        {
          key: 'VERIFICATION',
          component: <Verification step={3} refLink={this.props.refLink} type={1} />,
        },
      ] :
        [
          { key: 'ACCREDITATION_FORM' },
          { key: 'NETWORTH_QAL_FORM', enableNextBtn: true },
          { key: 'INCOME_EVIDENCE_FORM' },
          {
            key: 'VERIFICATION',
            component: <Verification step={3} refLink={this.props.refLink} type={1} />,
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
