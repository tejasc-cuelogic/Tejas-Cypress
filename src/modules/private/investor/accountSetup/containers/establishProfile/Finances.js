import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { FormInput, FormCheckbox } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class Finances extends Component {
  render() {
    const { FINANCES, financesChange } = this.props.investorProfileStore;
    return (
      <div>
        <Header as="h1" textAlign="center">
          Financial Information
        </Header>
        <Header as="h4" textAlign="center">
          Please provide the following information so that
          we can determine which investments we are allowed to show you
        </Header>
        <Form error>
          <FormInput
            fielddata={FINANCES.fields.netWorth}
            changed={financesChange}
          />
          <Form.Group widths="equal">
            {['annualIncome1', 'annualIncome2', 'annualIncome3'].map(field => (
              <FormInput
                key={field}
                fielddata={FINANCES.fields[field]}
                name={field}
                changed={financesChange}
              />
            ))
            }
          </Form.Group>
          <FormCheckbox
            fielddata={FINANCES.fields.checkbox1}
            name="checkbox1"
            changed={financesChange}
            defaults
          />
          <FormInput
            fielddata={FINANCES.fields.companyName}
            name="companyName"
            changed={financesChange}
          />
          <FormCheckbox
            fielddata={FINANCES.fields.checkbox2}
            name="checkbox2"
            changed={financesChange}
            defaults
          />
          <FormInput
            fielddata={FINANCES.fields.firmName}
            name="firmName"
            changed={financesChange}
          />
        </Form>
      </div>
    );
  }
}
