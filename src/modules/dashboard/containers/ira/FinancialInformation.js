import React from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Input, Popup, Icon, Label } from 'semantic-ui-react';

import validationActions from '../../../../actions/validation';
import FieldError from '../../../../components/common/FieldError';

@inject('accountStore')
@observer
export default class FinancialInformation extends React.Component {
  handleInputChange = (e, { name, value }) => {
    validationActions.validateIraAccountField(name, value);
  }
  render() {
    const { iraAccount } = this.props.accountStore;
    return (
      <div>
        <div>
          <Header as="h2" textAlign="center">Complete your financial information</Header>
          <p className="center-align">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <Form error>
            <div className="field-wrap">
              <Form.Field>
                { /*  eslint-disable jsx-a11y/label-has-for */ }
                <label>
                  {iraAccount.networth.label}
                  <Popup
                    trigger={<Icon name="help circle outline" />}
                    content="Tell us your net worth in $"
                    position="top center"
                    className="center-align"
                  />
                </label>
                <Input labelPosition="right" type="text" placeholder="Amount">
                  <Label basic>$</Label>
                  <input />
                </Input>
                <Input
                  name={iraAccount.networth.key}
                  placeholder={iraAccount.networth.placeHolder}
                  value={iraAccount.networth.value}
                  error={!!iraAccount.networth.error}
                  onChange={this.handleInputChange}
                  maxLength={10}
                />
                <FieldError error={iraAccount.networth.error} />
              </Form.Field>
              <Form.Field>
                <label>
                  {iraAccount.annualIncome.label}
                  <Popup
                    trigger={<Icon name="help circle outline" />}
                    content="Tell us your annual income in $"
                    position="top center"
                    className="center-align"
                  />
                </label>
                <Input
                  name={iraAccount.annualIncome.key}
                  placeholder={iraAccount.annualIncome.placeHolder}
                  value={iraAccount.annualIncome.value}
                  error={!!iraAccount.annualIncome.error}
                  onChange={this.handleInputChange}
                  maxLength={12}
                />
                <FieldError error={iraAccount.annualIncome.error} />
              </Form.Field>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
