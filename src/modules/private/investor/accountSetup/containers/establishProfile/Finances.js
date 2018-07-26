import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { FormInput, MaskedInput2, FormCheckbox } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class Finances extends Component {
  render() {
    const { FINANCES, financesChange } = this.props.investorProfileStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Financial Information</Header>
        <p className="center-align mb-50">
          Please provide the following information so that
          we can determine which investments we are allowed to show you
        </p>
        <Form error>
          <MaskedInput2
            name="netWorth"
            currency
            fielddata={FINANCES.fields.netWorth}
            changed={financesChange}
          />
          <Form.Group widths="equal">
            {['annualIncome1', 'annualIncome2', 'annualIncome3'].map(field => (
              <MaskedInput2
                key={field}
                name={field}
                currency
                value={FINANCES.fields[field].value}
                fielddata={FINANCES.fields[field]}
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
            disabled={FINANCES.fields.checkbox1.value &&
              FINANCES.fields.checkbox1.value.length === 0}
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
            disabled={FINANCES.fields.checkbox2.value &&
              FINANCES.fields.checkbox2.value.length === 0}
          />
        </Form>
      </div>
    );
  }
}
