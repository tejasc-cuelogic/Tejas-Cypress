import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import { FormRadioGroup, FormInput } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class Employment extends Component {
  render() {
    const { EMPLOYMENT_FORM, employmentChange } = this.props.investorProfileStore;
    return (
      <div>
        <Header as="h3" textAlign="center">What is your employment status?</Header>
        <p className="center-align mb-50">Please indicate your current employment status</p>
        <Form error>
          <FormRadioGroup
            fielddata={EMPLOYMENT_FORM.fields.status}
            name="status"
            changed={(e, result) => employmentChange(e, 'EMPLOYMENT_FORM', result)}
            containerclassname="button-radio center-align"
          />
          {EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED' &&
          <div className="field-wrap">
            <Form.Group widths="equal">{
              ['employer', 'position'].map(field => (
                <FormInput
                  key={field}
                  fielddata={EMPLOYMENT_FORM.fields[field]}
                  name={field}
                  changed={(e, result) => employmentChange(e, 'EMPLOYMENT_FORM', result)}
                />
              ))}
            </Form.Group>
          </div>
          }
        </Form>
      </div>
    );
  }
}
