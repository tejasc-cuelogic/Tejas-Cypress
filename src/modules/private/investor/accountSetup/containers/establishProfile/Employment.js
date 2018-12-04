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
      <div className="center-align">
        <Header as="h3">What is your employment status?</Header>
        <p className="mb-40">Please indicate your current employment status</p>
        <Form error>
          <FormRadioGroup
            fielddata={EMPLOYMENT_FORM.fields.status}
            name="status"
            changed={(e, result) => employmentChange(e, 'EMPLOYMENT_FORM', result)}
            containerclassname="button-radio center-align"
            classname="center-align"
            showerror
          />
          {EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED' &&
          <div className="field-wrap left-align">
            <Form.Group widths="equal">{
              ['employer', 'position'].map(field => (
                <FormInput
                  key={field}
                  fielddata={EMPLOYMENT_FORM.fields[field]}
                  name={field}
                  changed={(e, result) => employmentChange(e, 'EMPLOYMENT_FORM', result)}
                  showerror
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
