import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Form, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { INCOME_EVIDENCE_META } from './../../../../../../../services/constants/investmentLimit';

@inject('accreditationStore')
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
      <Aux>
        <Header as="h3" textAlign="center">{ACCREDITATION_FORM.fields.accreditationMethods.value === 'income' ? 'Income evidence' : 'Assets' }</Header>
        <p className="center-align">You can provide evidence of accreditation either through the verification of a professional advisor or by uploading the required documents.</p>
        <Form error className="account-type-tab">
          <Grid columns={1}>
            {incEvidenceMethods.map(method => (
              <Grid.Column
                onClick={e => incomeEvidenceChange(e, { name: 'incEvidenceMethods', value: method.value })}
              >
                <div className={`user-type ${(INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === method.value ? 'active' : '')}`}>
                  <Header as="h6">{method.header}</Header>
                  <p>
                    {method.desc}
                  </p>
                </div>
              </Grid.Column>
            ))}
          </Grid>
        </Form>
      </Aux>
    );
  }
}
