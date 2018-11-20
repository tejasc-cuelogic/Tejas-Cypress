import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Verification from './shared/Verification';
import PopulateAccreditationSteps from './PopulateAccreditationSteps';
import { NET_WORTH } from './../../../../../../services/constants/investmentLimit';

@inject('accreditationStore')
@withRouter
@observer
export default class Accreditation extends React.Component {
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
      ACCREDITATION_FORM,
    } = this.props.accreditationStore;
    const formArray = ACCREDITATION_FORM.fields.method.value === 'ASSETS' ?
      [
        { key: 'ACCREDITATION_FORM' },
        { key: 'NET_WORTH_FORM' },
        { key: 'INCOME_EVIDENCE_FORM' },
        {
          key: 'VERIFICATION',
          component: <Verification step={3} refLink={this.props.refLink} type={1} />,
        },
      ]
      :
      [
        { key: 'ACCREDITATION_FORM' },
        { key: 'INCOME_EVIDENCE_FORM' },
        {
          key: 'VERIFICATION',
          component: <Verification step={2} refLink={this.props.refLink} type={1} />,
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
