import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import moment from 'moment';
import { MaskedInput, FormRadioGroup, FormDatePicker } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class Inputs extends Component {
  render() {
    const {
      MODEL_INPUTS_FRM,
      formChange,
      maskChange,
      onDateChange,
    } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Header as="h4">
          Inputs
        </Header>
        <Form>
          <Form.Group widths="equal">
            {
              ['totalFunding', 'loanAmount', 'debtServiceOutsideNs'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={MODEL_INPUTS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                  prefix="$"
                  currency
                />
              ))
            }
          </Form.Group>
          <Form.Group widths={3}>
            {
              ['personalCreditScore', 'industryExperience'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={MODEL_INPUTS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                  number
                />
              ))
            }
            <div className="field">
              <Header as="label">Personal Guarantee</Header>
              <FormRadioGroup
                fielddata={MODEL_INPUTS_FRM.fields.personalGuarantee}
                name="personalGuarantee"
                changed={(e, result) => formChange(e, result, 'MODEL_INPUTS_FRM')}
              />
            </div>
          </Form.Group>
          <FormDatePicker
            name="companyInceptionDate"
            placeholder="1/1/18"
            selected={MODEL_INPUTS_FRM.fields.companyInceptionDate.value ?
              moment(MODEL_INPUTS_FRM.fields.companyInceptionDate.value) : null}
            changed={date => onDateChange('MODEL_INPUTS_FRM', 'companyInceptionDate', date)}
            fielddata={MODEL_INPUTS_FRM.fields.companyInceptionDate}
            containerwidth={5}
          />
          <Header as="h4">
            Y1 Financial Information
          </Header>
          <Form.Group widths="equal">
            {
              ['grossSales', 'grossProfit', 'totalOperExp'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={MODEL_INPUTS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                  prefix="$"
                  currency
                />
              ))
            }
          </Form.Group>
          <Form.Group widths="equal">
            {
              ['dda', 'interest', 'tax'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={MODEL_INPUTS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                  number
                />
              ))
            }
          </Form.Group>
          <Header as="h4">
            Projected Revenue
          </Header>
          <Form.Group widths="equal">
            {
              ['y1', 'y2', 'y3'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={MODEL_INPUTS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                  prefix="$"
                  currency
                />
              ))
            }
          </Form.Group>
          <Form.Group widths={3}>
            {
              ['y4', 'y5'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={MODEL_INPUTS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                  prefix="$"
                  currency
                />
              ))
            }
          </Form.Group>
        </Form>
      </Aux>
    );
  }
}
