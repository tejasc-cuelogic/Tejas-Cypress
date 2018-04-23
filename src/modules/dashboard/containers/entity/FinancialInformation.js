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
            {/* <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for * / }
              <label>
                {entityAccount.entityNetAssets.label}
                <Popup
                  trigger={<Icon name="ns-help-circle outline" />}
                  content="What is your net entity assets?"
                  position="top center"
                  className="center-align"
                />
              </label>
              <Input
                name={entityAccount.entityNetAssets.key}
                placeholder={entityAccount.entityNetAssets.placeHolder}
                value={entityAccount.entityNetAssets.value}
                error={!!entityAccount.entityNetAssets.error}
                onChange={this.handleInputChange}
                labelPosition="right"
                type="text"
              >
                <Label basic>$</Label>
                <input />
              </Input>
              <FieldError error={entityAccount.entityNetAssets.error} />
            </Form.Field>
            <Form.Field>
              <label>
                {entityAccount.cfInvestments.label}
                <Popup
                  trigger={<Icon name="ns-help-circle outline" />}
                  content={entityAccount.cfInvestments.label}
                  position="top center"
                  className="center-align" */}
            {
              ['entityNetAssets', 'cfInvestments'].map(field => (
                <FormInput
                  type="text"
                  fielddata={formFinInfo.fields[field]}
                  name={field}
                  changed={finInfoChange}
                />
              ))
            }
          </div>
        </Form>
      </div>
    );
  }
}
