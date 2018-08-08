import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../../../theme/form';

class AccountType extends Component {
  state = {
    investAccountType: {
      value: 0,
      values: [
        {
          label: 'Individual',
          value: 0,
          rawValue: 'individual',
        },
        {
          label: 'IRA',
          value: 1,
          rawValue: 'ira',
        },
        {
          label: 'Entity',
          value: 2,
          rawValue: 'entity ',
        },
      ],
      error: undefined,
      rule: 'required',
    },
  };
  radioChnaged = (e, res) => {
    this.setState({ investAccountType: { ...this.state.investAccountType, value: res.value } });
  }
  render() {
    return (
      <div>
        <Header as="h3" textAlign="center">Which Investment Account would you like to invest from?</Header>
        <p className="center-align">Choose an account type</p>
        <Form error className="account-type-tab">
          <FormRadioGroup
            name="investAccountType"
            containerclassname="button-radio center-align"
            fielddata={this.state.investAccountType}
            changed={this.radioChnaged}
          />
        </Form>
      </div>
    );
  }
}
export default AccountType;
