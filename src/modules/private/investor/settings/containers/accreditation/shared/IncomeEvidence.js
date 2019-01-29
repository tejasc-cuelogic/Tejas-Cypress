import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Form, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { INCOME_EVIDENCE_META } from './../../../../../../../services/constants/investmentLimit';

@inject('accreditationStore')
@withRouter
@observer
export default class IncomeEvidence extends Component {
  render() {
    const {
      ACCREDITATION_FORM,
      INCOME_EVIDENCE_FORM,
      incomeEvidenceChange,
    } = this.props.accreditationStore;
    const incEvidenceMethods = INCOME_EVIDENCE_META.slice();
    return (
      <div>
        <Header as="h3" textAlign="center">{this.props.isEntity ? 'Provide evidence of accreditation' : ACCREDITATION_FORM.fields.method.value === 'INCOME' ? 'Income evidence' : 'Evidence of Assets' }</Header>
        <p className="center-align">You can provide evidence of accreditation either through the verification of a professional advisor or by uploading the required documents.</p>
        <Form error className="account-type-tab">
          <Grid columns={1}>
            {incEvidenceMethods.map(method => (
              <Grid.Column
                onClick={e => incomeEvidenceChange(e, { name: 'incEvidenceMethods', value: method.value })}
              >
                <div className={`user-type ${(INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === method.value ? 'active' : '')}`}>
                  <Header as="h6">{method.header}</Header>
                  {((this.props.isTrust || ACCREDITATION_FORM.fields.method.value === 'ASSETS' || ACCREDITATION_FORM.fields.method.value === 'REVOCABLE_TRUST_ASSETS') && method.value === 'uploaddocument' && !this.props.isEntity) ?
                    <p> {method.desc2} </p> :
                    <p> {method.desc} </p>
                    }
                </div>
              </Grid.Column>
            ))}
          </Grid>
        </Form>
      </div>
    );
  }
}
