import React, { Component } from 'react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';
import { FormRadioGroup } from '../../../../../../../theme/form';

@inject('iraAccountStore')
@observer
export default class AccountType extends Component {
  getOptionDetails = () => {
    const { value, values } = this.props.iraAccountStore.ACC_TYPES_FRM.fields.iraAccountType;
    return find(values, v => v.value === value) ? find(values, v => v.value === value).description : '';
  };
  render() {
    const { ACC_TYPES_FRM, accTypesChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">What type of IRA account do you want to create?</Header>
        <Divider hidden />
        <p className="center-align tertiary-text">Choose an account type</p>
        <Divider section hidden />
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={ACC_TYPES_FRM.fields.iraAccountType}
            name="iraAccountType"
            changed={accTypesChange}
            containerclassname="button-radio center-align"
          />
          <Divider section hidden />
          <div className="option-details grey-header">
            {this.getOptionDetails()}
          </div>
          <Divider section hidden />
        </Form>
      </div>
    );
  }
}
