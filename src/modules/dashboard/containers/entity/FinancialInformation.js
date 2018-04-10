import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Input, Popup, Icon } from 'semantic-ui-react';

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
        <Header as="h2">Complete financial info about entity</Header>
        <Form error>
          <Form.Field>
            { /*  eslint-disable jsx-a11y/label-has-for */ }
            <label>
              {entityAccount.entityNetAssets.label}
              <Popup
                trigger={<Icon name="help circle outline" />}
                content="Put your first name as listed on your driver license"
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
            />
            <FieldError error={entityAccount.entityNetAssets.error} />
          </Form.Field>
          <Form.Field>
            <label>
              {entityAccount.cfInvestments.label}
              <Popup
                trigger={<Icon name="help circle outline" />}
                content="Put your first name as listed on your driver license"
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
            />
            <FieldError error={entityAccount.cfInvestments.error} />
          </Form.Field>
        </Form>
      </div>
    );
  }
}
