import React, { Component } from 'react';
import { Header, Form, Input } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import FieldError from '../../../../components/common/FieldError';
import validationActions from '../../../../actions/validation';

@inject('accountStore', 'userStore')
@observer
export default class PersonalInformation extends Component {
  handleInputChange = (e, { name, value }) => {
    validationActions.validateEntityAccountField(name, value);
  }
  render() {
    const { entityAccount } = this.props.accountStore;
    const { currentUser } = this.props.userStore;

    return (
      <div>
        <Header as="h2">Complete personal info about entity</Header>
        {currentUser.givenName}
        {currentUser.familyName}
        <Form error>
          <Form.Field>
            { /*  eslint-disable jsx-a11y/label-has-for */ }
            <label>
              {entityAccount.entityTitle.label}
            </label>
            <Input
              name={entityAccount.entityTitle.key}
              placeholder={entityAccount.entityTitle.placeHolder}
              value={entityAccount.entityTitle.value}
              error={!!entityAccount.entityTitle.error}
              onChange={this.handleInputChange}
            />
            <FieldError error={entityAccount.entityTitle.error} />
          </Form.Field>
        </Form>
      </div>
    );
  }
}
