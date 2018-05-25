import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form/FormElements';

@inject('entityAccountStore')
@observer
export default class FinancialInformation extends Component {
  render() {
    const { formFinInfo, finInfoChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Complete financial info about entity</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        <Form error>
          <div className="field-wrap">
            {
              ['netAssets', 'cfInvestment'].map(field => (
                <FormInput
                  key={field}
                  name={field}
                  fielddata={formFinInfo.fields[field]}
                  maxLength={formFinInfo.fields[field].maxLength}
                  changed={finInfoChange}
                  prefix="$"
                />
              ))
            }
          </div>
        </Form>
      </div>
    );
  }
}
