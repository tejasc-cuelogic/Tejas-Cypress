import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';
import { FormRadioGroup } from '../../../../../../theme/form';

@inject('iraAccountStore')
@observer
export default class Verification extends Component {
  getOptionDetails = () => {
    const { value, values } = this.props.iraAccountStore.formAccTypes.fields.iraAccountType;
    return find(values, v => v.value === value).description;
  };
  render() {
    const { formAccTypes, AccTypesChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">What type of IRA account you want to create?</Header>
        <p className="center-align">Choose an account type</p>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={formAccTypes.fields.iraAccountType}
            name="iraAccountType"
            changed={AccTypesChange}
          />
          <div className="option-details">
            {this.getOptionDetails()}
          </div>
        </Form>
      </div>
    );
  }
}
