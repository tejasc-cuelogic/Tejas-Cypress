import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup } from '../../../../../../../theme/form';

@inject('accreditationStore')
@observer
export default class IncomeEvidence extends Component {
  render() {
    const {
      ACCREDITATION_FORM,
      INCOME_EVIDENCE_FORM,
      incomeEvidenceChange,
    } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">{ACCREDITATION_FORM.fields.accreditationMethods.value === 'income' ? 'Income evidence' : 'Assets' }</Header>
        <p className="center-align">You can provide evidence of accreditation either through the verification of a professional advisor or by uploading the required documents.</p>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={INCOME_EVIDENCE_FORM.fields.incEvidenceMethods}
            name="incEvidenceMethods"
            changed={incomeEvidenceChange}
            containerclassname="button-radio center-align"
          />
        </Form>
      </div>
    );
  }
}
