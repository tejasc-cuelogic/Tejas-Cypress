import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from 'semantic-ui-react';
import { FormRadioGroup, FormInput } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class Employment extends Component {
  render() {
    const { EMPLOYMENT_FORM, employmentChange } = this.props.investorProfileStore;
    return (
      <div>
        <Form error>
          <FormRadioGroup
            fielddata={EMPLOYMENT_FORM.fields.employmentStatus}
            name="employmentStatus"
            changed={employmentChange}
          />
          {
          ['employer', 'currentPosition'].map(field => (
            <FormInput
              key={field}
              fielddata={EMPLOYMENT_FORM.fields[field]}
              name={field}
              changed={employmentChange}
            />
          ))
          }
        </Form>
      </div>
    );
  }
}
