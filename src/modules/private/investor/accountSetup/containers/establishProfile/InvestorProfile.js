import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class InvestorProfile extends Component {
  render() {
    const { INVESTOR_PROFILE_FORM, investorProfileChange } = this.props.investorProfileStore;
    return (
      <div>
        <Header as="h1" textAlign="center">
          Investor Profile
        </Header>
        <Header as="h4" textAlign="center">
          Please provide the following information so that we can determine which investments
          we are allowed to show you
        </Header>
        <Form error>
          <FormRadioGroup
            fielddata={INVESTOR_PROFILE_FORM.fields.investorProfileType}
            name="investorProfileType"
            changed={investorProfileChange}
            containerclassname="button-radio center-align"
          />
        </Form>
      </div>
    );
  }
}
