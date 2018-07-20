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
        <Header as="h1" textAlign="center">
          What is your employment status?
        </Header>
        <Header as="h4" textAlign="center">
          Please indicate your current employment status
        </Header>
        <Form error>
          <FormRadioGroup
            fielddata={EMPLOYMENT_FORM.fields.employmentStatus}
            name="employmentStatus"
            changed={employmentChange}
            containerclassname="button-radio center-align"
          />
          {EMPLOYMENT_FORM.fields.employmentStatus.value === 'EMPLOYED' &&
          <div className="field-wrap">
            <Form.Group widths="equal">{
              ['employer', 'currentPosition'].map(field => (
                <FormInput
                  key={field}
                  fielddata={EMPLOYMENT_FORM.fields[field]}
                  name={field}
                  changed={employmentChange}
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
