import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';
import { FormRadioGroup } from '../../../../theme/form/FormElements';

@inject('iraAccountStore')
@observer
export default class AccountType extends Component {
  getOptionDetails = () => {
    const { value, values } = this.props.iraAccountStore.formAccTypes.fields.accountType;
    return find(values, v => v.value === value).description;
  };
  render() {
    const { formAccTypes, AccTypesChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">What type of IRA account you want to create?</Header>
        <Header as="h4" textAlign="center">Choose an account type</Header>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={formAccTypes.fields.accountType}
            name="accountType"
            changed={AccTypesChange}
            containerclassname="button-radio center-align"
          />
          <div className="option-details">
            {this.getOptionDetails()}
          </div>
        </Form>
      </div>
    );
  }
}
