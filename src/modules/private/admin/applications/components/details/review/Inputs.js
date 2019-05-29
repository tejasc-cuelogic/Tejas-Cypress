import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { MaskedInput, FormRadioGroup } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class Inputs extends Component {
  render() {
    const {
      MODEL_INPUTS_FRM,
      formChange,
      maskChange,
    } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Header as="h4">Inputs</Header>
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
          <Header as="h4">Y1 Financial Information</Header>
          <Form.Group widths={3}>
            {['grossSales', 'grossProfit', 'totalOperExp'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_INPUTS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                prefix="$"
                currency
              />
            ))}
            {['dda', 'interest', 'tax'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_INPUTS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                number
              />
            ))}
          </Form.Group>
          <Header as="h4">Projected Revenue</Header>
          <Form.Group widths={3}>
            {['y1', 'y2', 'y3', 'y4', 'y5'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_INPUTS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                prefix="$"
                currency
              />
            ))}
          </Form.Group>
        </Form>
      </Aux>
    );
  }
}
