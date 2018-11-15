import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import VerificationForm from '../shared/VerificationForm';
import AssetsUploadDocument from '../assets/UploadDocument';
import IncomeUploadDocument from '../income/UploadDocument';

@inject('accreditationStore')
@observer
export default class Verification extends Component {
  render() {
    const { ACCREDITATION_FORM, INCOME_EVIDENCE_FORM } = this.props.accreditationStore;
    return (
      INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ?
        <VerificationForm refLink={this.props.refLink} /> :
        ACCREDITATION_FORM.fields.accreditationMethods.value === 'income' ?
          <IncomeUploadDocument refLink={this.props.refLink} /> :
          <AssetsUploadDocument refLink={this.props.refLink} />
    );
  }
}
