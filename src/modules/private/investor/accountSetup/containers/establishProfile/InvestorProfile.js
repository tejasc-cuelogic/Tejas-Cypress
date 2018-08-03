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
        <Header as="h3" textAlign="center">Investor Profile</Header>
        <p className="center-align mb-50">
          Please provide the following information so that we can determine which investments
          we are allowed to show you
        </p>
        <Form>
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
