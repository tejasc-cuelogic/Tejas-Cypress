import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';
import { FormRadioGroup } from '../../../../theme/form';

@inject('iraAccountStore')
@observer
export default class Funding extends Component {
  getOptionDetails = () => {
    const { value, values } = this.props.iraAccountStore.formFunding.fields.fundingType;
    return find(values, v => v.value === value).description;
  };
  render() {
    const { formFunding, fundingChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">How would you like to fund your IRA?</Header>
        <Header as="h4" textAlign="center">Choose funding option</Header>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={formFunding.fields.fundingType}
            name="fundingType"
            changed={fundingChange}
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
