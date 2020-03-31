import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { INCOME_EVIDENCE_META } from '../../../../../../../services/constants/investmentLimit';
import { FormArrowButton } from '../../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;
@inject('accreditationStore')
@withRouter
@observer
export default class IncomeEvidence extends Component {
  constructor(props) {
    super(props);
    const { calculateEvidenceMethod } = this.props.accreditationStore;
    const incEvidenceMethods = INCOME_EVIDENCE_META.slice();
    calculateEvidenceMethod(incEvidenceMethods, this.props.isEntity, this.props.isTrust);
  }

  render() {
    const {
      ACCREDITATION_FORM,
      // INCOME_EVIDENCE_FORM,
      EVIDENCE_FORM_META,
      incomeEvidenceChange,
    } = this.props.accreditationStore;
    const acrreditationType = ACCREDITATION_FORM.fields.method.value === 'INCOME' ? 'income' : 'net worth';
    return (
      <div>
        <Header as="h4">{this.props.isEntity ? 'Provide evidence of status' : `How would you prefer to verify your ${acrreditationType}?`}</Header>
        {/* <Header as="h4">{this.props.isEntity ? 'Provide evidence of status' : ACCREDITATION_FORM.fields.method.value === 'INCOME' ? 'Income' : 'Net Worth'}</Header>
        <p>
          {this.props.isEntity ? 'How would you like to confirm your status as an accredited investor?' : ACCREDITATION_FORM.fields.method.value === 'INCOME'
            ? 'You can provide evidence of your status as an accredited investor either by verification from a professional advisor or by uploading documentation evidencing your income for the prior two years.'
            : 'You can provide evidence of your status as an accredited investor either by verification from a professional advisor or by uploading documentation evidencing your net worth.          '
          }
        </p> */}
        <Form error className={isMobile ? '' : 'account-type-tab'}>
          {/* <Grid columns={1}>
            {incEvidenceMethods.map(method => (
              <Grid.Column
                key={method.value}
                onClick={e => incomeEvidenceChange(e, { name: 'incEvidenceMethods', value: method.value })}
              >
                <div className={`user-type ${(INCOME_EVIDENCE_FORM.fields.incEvidenceMethods.value === method.value ? 'active' : '')}`}>
                  <Header as="h6">{this.props.isEntity ? method.header2 : method.header1}</Header>
                  <p>
                    {method.value === 'uploaddocument' ? this.props.isTrust ? method.desc4 : this.props.isEntity ? method.desc3
                      : ACCREDITATION_FORM.fields.method.value === 'ASSETS' ? method.desc2 : method.desc1 : ''}
                    {method.value === 'verificationrequest'
                      ? this.props.isTrust ? method.desc3 : this.props.isEntity ? method.desc2
                        : method.desc1 : ''
                    }
                  </p>
                </div>
              </Grid.Column>
            ))}
          </Grid>
          <Button onClick={this.props.submitStep} primary size="large" fluid={isMobile} className="mt-40 relaxed" content="Continue" /> */}
          <FormArrowButton
            fielddata={EVIDENCE_FORM_META.fields.method}
            name="incEvidenceMethods"
            changed={incomeEvidenceChange}
            action={this.props.submitStep}
          />
        </Form>
        {ACCREDITATION_FORM.fields.method.value === false
          && (
            <p className="center-align">
              Note: Verification of your accredited investor status using net worth is only valid for
              90 days from the date of your most recently submitted documentation.
            </p>
          )
        }
      </div>
    );
  }
}
