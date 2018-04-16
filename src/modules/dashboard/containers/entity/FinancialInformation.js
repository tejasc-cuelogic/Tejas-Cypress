import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import FormInput from '../../../../components/form/FormInput';

@inject('entityAccountStore')
@observer
export default class FinancialInformation extends Component {
  render() {
    const { formFinInfo, onFieldChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Complete financial info about entity</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        <Form error>
          <div className="field-wrap">
            <FormInput
              type="text"
              name="entityNetAssets"
              label={formFinInfo.fields.entityNetAssets.label}
              tooltip="What is your net entity assets?"
              value={formFinInfo.fields.entityNetAssets.value}
              error={formFinInfo.fields.entityNetAssets.error}
              changed={onFieldChange}
            />
            <FormInput
              type="text"
              name="cfInvestments"
              label={formFinInfo.fields.cfInvestments.label}
              tooltip="Other religion CF investments made in prior 12 months"
              value={formFinInfo.fields.cfInvestments.value}
              error={formFinInfo.fields.cfInvestments.error}
              changed={onFieldChange}
            />
          </div>
        </Form>
      </div>
    );
  }
}
