import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';
import { FormRadioGroup } from '../../../../../../../theme/form';

@inject('iraAccountStore')
@observer
export default class Funding extends Component {
  getOptionDetails = () => {
    const { value, values } = this.props.iraAccountStore.FUNDING_FRM.fields.fundingType;
    return find(values, v => v.value === value) ? find(values, v => v.value === value).description : '';
  };
  render() {
    const { FUNDING_FRM, fundingChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">How would you like to fund your IRA?</Header>
        <p className="center-align">Choose funding option</p>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={FUNDING_FRM.fields.fundingType}
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
