import React, { Component } from 'react';
import { Header, Form, Input } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import validationActions from '../../../../actions/validation';
import FieldError from '../../../../components/common/FieldError';

@inject('accountStore')
@observer
export default class General extends Component {
  handleInputChange = (e, { name, value }) => {
    validationActions.validateEntityAccountField(name, value);
  }
  render() {
    const { entityAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h2">General Information</Header>
        <Form error>
          <Form.Field>
            { /*  eslint-disable jsx-a11y/label-has-for */ }
            <label>
              {entityAccount.nameOfEntity.label}
            </label>
            <Input
              name={entityAccount.nameOfEntity.key}
              placeholder={entityAccount.nameOfEntity.placeHolder}
              value={entityAccount.nameOfEntity.value}
              error={!!entityAccount.nameOfEntity.error}
              onChange={this.handleInputChange}
            />
            <FieldError error={entityAccount.nameOfEntity.error} />
          </Form.Field>
          <Form.Field>
            <label>
              {entityAccount.taxId.label}
            </label>
            <Input
              name={entityAccount.taxId.key}
              placeholder={entityAccount.taxId.placeHolder}
              value={entityAccount.taxId.value}
              error={!!entityAccount.taxId.error}
              onChange={this.handleInputChange}
            />
            <FieldError error={entityAccount.taxId.error} />
          </Form.Field>
          <Form.Field>
            <label>
              {entityAccount.street.label}
            </label>
            <Input
              name={entityAccount.street.key}
              placeholder={entityAccount.street.placeHolder}
              value={entityAccount.street.value}
              error={!!entityAccount.street.error}
              onChange={this.handleInputChange}
            />
            <FieldError error={entityAccount.street.error} />
          </Form.Field>
          <Form.Field>
            <label>
              {entityAccount.city.label}
            </label>
            <Input
              name={entityAccount.city.key}
              placeholder={entityAccount.city.placeHolder}
              value={entityAccount.city.value}
              error={!!entityAccount.city.error}
              onChange={this.handleInputChange}
            />
            <FieldError error={entityAccount.city.error} />
          </Form.Field>
          <Form.Field>
            <label>
              {entityAccount.zipCode.label}
            </label>
            <Input
              name={entityAccount.zipCode.key}
              placeholder={entityAccount.zipCode.placeHolder}
              value={entityAccount.zipCode.value}
              error={!!entityAccount.zipCode.error}
              onChange={this.handleInputChange}
            />
            <FieldError error={entityAccount.zipCode.error} />
          </Form.Field>
        </Form>
      </div>
    );
  }
}
