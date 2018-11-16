import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import VerificationForm from '../shared/VerificationForm';
import AssetsUploadDocument from '../assets/UploadDocument';
import IncomeUploadDocument from '../income/UploadDocument';

@inject('accreditationStore')
@withRouter
@observer
export default class Verification extends Component {
  submit = (form) => {
    const { params } = this.props.match;
    this.props.accreditationStore
      .updateAccreditation(form, params.accountId, params.accountType.toUpperCase())
      .then(() => {
        this.props.history.push(`${this.props.refLink}/success`);
      }).catch(() => this.props.accreditationStore.setStepToBeRendered(this.props.step));
  }
  render() {
    const { ACCREDITATION_FORM, INCOME_EVIDENCE_FORM } = this.props.accreditationStore;
    const { isEntity } = this.props;
    return (
      INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ?
        <VerificationForm clicked={this.submit} /> :
        (ACCREDITATION_FORM.fields.method.value === 'INCOME') ?
          <IncomeUploadDocument clicked={this.submit} /> :
          <AssetsUploadDocument clicked={this.submit} isEntity={isEntity} />
    );
  }
}
