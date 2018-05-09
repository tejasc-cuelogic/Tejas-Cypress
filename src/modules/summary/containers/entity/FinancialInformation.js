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
              ['entityNetAssets', 'cfInvestments'].map(field => (
                <FormInput
                  type="text"
                  fielddata={formFinInfo.fields[field]}
                  name={field}
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
