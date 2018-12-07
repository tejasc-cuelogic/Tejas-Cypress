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
      .updateAccreditation(
        form,
        params.accountId,
        params.accountType.toUpperCase(),
        this.props.type || 0,
      )
      .then(() => {
        this.props.history.push(`${this.props.refLink}/success`);
      }).catch(() => this.props.accreditationStore.setStepToBeRendered(this.props.step));
  }
  render() {
    const { ACCREDITATION_FORM, INCOME_EVIDENCE_FORM } = this.props.accreditationStore;
    const { isEntity } = this.props;
    const { params } = this.props.match;
    return (
      INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest' ?
        <VerificationForm clicked={this.submit} /> :
        ((ACCREDITATION_FORM.fields.method.value === 'INCOME' || ACCREDITATION_FORM.fields.method.value === 'REVOCABLE_TRUST_INCOME')) ?
          <IncomeUploadDocument accountType={params.accountType} clicked={this.submit} /> :
          <AssetsUploadDocument
            accountType={params.accountType}
            clicked={this.submit}
            isEntity={isEntity}
          />
    );
  }
}
