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
        <Header as="h3" textAlign="center">{this.props.isEntity ? 'Provide evidence of status' : ACCREDITATION_FORM.fields.method.value === 'INCOME' ? 'Income' : 'NetWorth' }</Header>
        <p className="center-align">
          {this.props.isEntity ? 'How would you like to confirm your status as an accredited investor?' : ACCREDITATION_FORM.fields.method.value === 'INCOME' ?
        'You can provide evidence of your status as an accredited investor either by verification from a professional advisor or by uploading documentation evidencing your income for the prior two years.'
        :
          'You can provide evidence of your status as an accredited investor either by verification from a professional advisor or by uploading documentation evidencing your net worth.          '
        }
        </p>
        <Form error className="account-type-tab">
          <Grid columns={1}>
            {incEvidenceMethods.map(method => (
              <Grid.Column
                onClick={e => incomeEvidenceChange(e, { name: 'incEvidenceMethods', value: method.value })}
              >
                <div className={`user-type ${(INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === method.value ? 'active' : '')}`}>
                  <Header as="h6">{this.props.isEntity ? method.header2 : method.header1}</Header>
                  <p>
                    {method.value === 'uploaddocument' ? this.props.isTrust ? method.desc4 : this.props.isEntity ? method.desc3 :
                    ACCREDITATION_FORM.fields.method.value === 'ASSETS' ? method.desc2 : method.desc1 : ''}
                    {method.value === 'verificationrequest' ?
                    this.props.isTrust ? method.desc3 : this.props.isEntity ? method.desc2 :
                    method.desc1 : ''
                    }
                  </p>
                </div>
              </Grid.Column>
            ))}
          </Grid>
        </Form>
        {ACCREDITATION_FORM.fields.method.value === false &&
          <p className="center-align">
            Note: Verification of your accredited investor status using net worth is only valid for
            90 days from the date of your most recently submitted documentation.
          </p>
        }
      </div>
    );
  }
}
