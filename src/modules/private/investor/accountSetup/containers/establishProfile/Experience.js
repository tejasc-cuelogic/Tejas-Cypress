import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Form, Button } from 'semantic-ui-react';
import { FormRadioGroup, FormCheckbox } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class Experience extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const currentStep = {
      form: 'INVESTMENT_EXPERIENCE',
      stepToBeRendered: 3,
    };
    this.props.investorProfileStore.updateInvestorProfileData(currentStep);
  }
  render() {
    const { INVESTMENT_EXPERIENCE, experiencesChange } = this.props.investorProfileStore;
    return (
      <div>
        <Header as="h1" textAlign="center">
          Investment Experience
        </Header>
        <Header as="h4" textAlign="center">
          We are collecting the information below to better understand yout investment experience.
          We recognize your responses may change over time as you work with us.
          Please check the box that best descrives your investment experience to date
        </Header>
        <Form error>
          <FormRadioGroup
            fielddata={INVESTMENT_EXPERIENCE.fields.investmentExperienceLevel}
            name="investmentExperienceLevel"
            changed={experiencesChange}
            containerclassname="button-radio center-align"
          />
          <FormCheckbox
            fielddata={INVESTMENT_EXPERIENCE.fields.readyInvestingInLimitedLiquiditySecurities}
            name="readyInvestingInLimitedLiquiditySecurities"
            changed={experiencesChange}
            defaults
            containerclassname="ui relaxed list"
          />
          <FormCheckbox
            fielddata={INVESTMENT_EXPERIENCE.fields.readyForRisksInvolved}
            name="readyForRisksInvolved"
            changed={experiencesChange}
            defaults
            containerclassname="ui relaxed list"
          />
          <div className="center-align mt-30">
            <Button onClick={this.handleSubmit} primary size="large" as={Link} to="/app/summary/account-creation">Send verification request</Button>
          </div>
        </Form>
      </div>
    );
  }
}
