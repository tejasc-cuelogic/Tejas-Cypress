import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { MaskedInput, FormRadioGroup } from '../../../../../../../../theme/form';


@inject('businessAppReviewStore')
@observer
export default class LegalDocumentUpload extends Component {
  render() {
    const {
      MODEL_INPUTS_FRM,
      formChange,
      maskChange,
    } = this.props.businessAppReviewStore;
    return (
      <>
        <Header as="h4">Final Legal Document Uploads</Header>
        <Form>
          <Form.Group widths={3}>
            {['totalFunding', 'loanAmount', 'debtServiceOutsideNs'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_INPUTS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                prefix="$"
                currency
              />
            ))}
            {['personalCreditScore', 'industryExperience'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_INPUTS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                number
              />
            ))}
            <div className="field">
              <Header as="label">Personal Guarantee</Header>
              <FormRadioGroup
                fielddata={MODEL_INPUTS_FRM.fields.personalGuarantee}
                name="personalGuarantee"
                changed={(e, result) => formChange(e, result, 'MODEL_INPUTS_FRM')}
              />
            </div>
            <MaskedInput
              name="companyInceptionDate"
              fielddata={MODEL_INPUTS_FRM.fields.companyInceptionDate}
              format="##/##/####"
              changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
              dateOfBirth
              showerror
            />
          </Form.Group>
        </Form>
      </>
    );
  }
}
