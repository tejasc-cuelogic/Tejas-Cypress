import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { FormInput } from '../../../../components/form/FormElements';

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
            <FormInput
              type="text"
              fielddata={formFinInfo.fields.entityNetAssets}
              name="entityNetAssets"
              changed={finInfoChange}
            />
            <FormInput
              type="text"
              name="cfInvestments"
              fielddata={formFinInfo.fields.cfInvestments}
              changed={finInfoChange}
            />
          </div>
        </Form>
      </div>
    );
  }
}
