import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Input, Popup, Icon, Label } from 'semantic-ui-react';

import validationActions from '../../../../actions/validation';
import FieldError from '../../../../components/common/FieldError';

@inject('accountStore')
@observer
export default class FinancialInformation extends Component {
  handleInputChange = (e, { name, value }) => {
    validationActions.validateEntityAccountField(name, value);
  }
  render() {
    const { entityAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Complete financial info about entity</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        <Form error>
          <div className="field-wrap">
            <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for */ }
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
                  className="center-align"
                />
              </label>
              <Input
                name={entityAccount.cfInvestments.key}
                placeholder={entityAccount.cfInvestments.placeHolder}
                value={entityAccount.cfInvestments.value}
                error={!!entityAccount.cfInvestments.error}
                onChange={this.handleInputChange}
                labelPosition="right"
                type="text"
              >
                <Label basic>$</Label>
                <input />
              </Input>
              <FieldError error={entityAccount.cfInvestments.error} />
            </Form.Field>
          </div>
        </Form>
      </div>
    );
  }
}
