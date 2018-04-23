import React from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { FormInput } from '../../../../components/form/FormElements';

@inject('iraAccountStore')
@observer
export default class FinancialInformation extends React.Component {
  render() {
    const { formFinInfo, finInfoChange } = this.props.iraAccountStore;
    return (
      <div>
        <div>
          <Header as="h1" textAlign="center">Complete your financial information</Header>
          <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
          <Form error>
            <div className="field-wrap">
              {/* <Form.Field>
                { /*  eslint-disable jsx-a1 1y/label-has-for * / }
                <label>
                  {iraAccount.networth.label}
                  <Popup
                    trigger={<Icon name="ns-help-circle outline" />}
                    content="Tell us your net worth in $"
                    position="top center"
                    className="center-align"
                  />
                </label>
                <Input
                  name={iraAccount.networth.key}
                  placeholder={iraAccount.networth.placeHolder}
                  value={iraAccount.networth.value}
                  error={!!iraAccount.networth.error}
                  onChange={this.handleInputChange}
                  maxLength={10}
                  labelPosition="left"
                  type="text"
                >
                  <Label basic>$</Label>
                  <input />
                </Input>
                <FieldError error={iraAccount.networth.error} />
              </Form.Field>
              <Form.Field>
                <label>
                  {iraAccount.annualIncome.label}
                  <Popup
                    trigger={<Icon name="ns-help-circle outline" />}
                    content="Tell us your annual income in $"
                    position="top center"
                    className="center-align" */}
              {
                ['networth', 'annualIncome'].map(field => (
                  <FormInput
                    key={field}
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
      </div>
    );
  }
}
