import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import VerificationForm from './VerificationForm';
import AssetsUploadDocument from '../assets/UploadDocument';
import IncomeUploadDocument from '../income/UploadDocument';

@inject('accreditationStore')
@withRouter
@observer
export default class Verification extends Component {
  submit = (form) => {
    const { accountType } = this.props;
    this.props.accreditationStore
      .updateAccreditation(
        form,
        accountType.toUpperCase(),
        this.props.type || 0,
      )
      .then(() => {
        this.props.history.push(`${this.props.refLink}/success`);
      }).catch(() => this.props.accreditationStore.setStepToBeRendered(this.props.step));
  }

  render() {
    const {
      ACCREDITATION_FORM, INCOME_EVIDENCE_FORM,
    } = this.props.accreditationStore;
    const { isEntity, accountType } = this.props;
    return (
      INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'verificationrequest'
        ? <VerificationForm clicked={this.submit} {...this.props} /> : isEntity
          ? (
            <AssetsUploadDocument
              accountType={accountType}
              clicked={this.submit}
              isEntity={isEntity}
              isUploadLater={INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'uploaddocumentLatter'}
              {...this.props}
            />
          )
          : (ACCREDITATION_FORM.fields.method.value === 'INCOME' && INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value !== 'uploaddocumentLatter')
            ? <IncomeUploadDocument accountType={accountType} clicked={this.submit} {...this.props} />
            : (
              <AssetsUploadDocument
                accountType={accountType}
                clicked={this.submit}
                isEntity={isEntity}
                isUploadLater={INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === 'uploaddocumentLatter'}
                isIncome={ACCREDITATION_FORM.fields.method.value === 'INCOME'}
                {...this.props}
              />
            )
    );
  }
}
