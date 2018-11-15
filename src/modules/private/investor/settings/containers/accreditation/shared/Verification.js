import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import VerificationForm from '../shared/VerificationForm';
import AssetsUploadDocument from '../assets/UploadDocument';
import IncomeUploadDocument from '../income/UploadDocument';

@inject('accreditationStore')
@observer
export default class Verification extends Component {
  submit = (form) => {
    const { params } = this.props;
    this.props.accreditationStore
      .updateAccreditation(form, params.accountId, params.accountType.toUpperCase())
      .then(() => {
        this.props.history.push(`${this.props.match.url}/success`);
      }).catch(() => {
      });
  }
  render() {
    const { ACCREDITATION_FORM, INCOME_EVIDENCE_FORM } = this.props.accreditationStore;
    return (
      INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ?
        <VerificationForm clicked={this.submit} /> :
        ACCREDITATION_FORM.fields.method.value === 'income' ?
          <IncomeUploadDocument clicked={this.submit} /> :
          <AssetsUploadDocument clicked={this.submit} />
    );
  }
}
