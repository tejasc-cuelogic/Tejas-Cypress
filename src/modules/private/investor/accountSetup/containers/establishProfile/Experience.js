import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Form, Button } from 'semantic-ui-react';
import { FormRadioGroup, FormCheckbox } from '../../../../../../theme/form';

@inject('investorProfileStore', 'userDetailsStore')
@withRouter
@observer
export default class Experience extends Component {
  handleSubmitInvestmentExperience = () => {
    const {
      validateInvestmentExperience,
      INVESTMENT_EXP_FORM,
      updateInvestorProfileData,
    } = this.props.investorProfileStore;
    validateInvestmentExperience();
    if (INVESTMENT_EXP_FORM.meta.isValid &&
      this.props.investorProfileStore.isInvestmentExperienceValid) {
      const currentStep = {
        form: 'INVESTMENT_EXP_FORM',
        stepToBeRendered: 6,
      };
      updateInvestorProfileData(currentStep);
      const { signupStatus } = this.props.userDetailsStore;
      if (signupStatus.isMigratedFullAccount) {
        this.props.history.push('/app/summary');
      } else {
        this.props.history.push('/app/summary/account-creation');
      }
    }
  }
  render() {
    const {
      INVESTMENT_EXP_FORM,
      isInvestmentExperienceValid,
      experiencesChange,
    } = this.props.investorProfileStore;
    return (
      <Aux>
        <Header as="h3" textAlign="center">Investment Experience</Header>
        <p className="center-align mb-40">
          Confirm your experience and understanding of the investment risks on NextSeed.
          Select the box that best describes your investment experience to date:
        </p>
        <Form error onSubmit={this.handleSubmitInvestmentExperience}>
          <FormRadioGroup
            fielddata={INVESTMENT_EXP_FORM.fields.experienceLevel}
            name="experienceLevel"
            changed={experiencesChange}
            containerclassname="two wide button-radio center-align mb-50"
            showerror
          />
          <FormCheckbox
            fielddata={INVESTMENT_EXP_FORM.fields.isComfortable}
            name="isComfortable"
            changed={experiencesChange}
            defaults
            containerclassname="ui relaxed list"
          />
          <FormCheckbox
            fielddata={INVESTMENT_EXP_FORM.fields.isRiskTaker}
            name="isRiskTaker"
            changed={experiencesChange}
            defaults
            containerclassname="ui relaxed list"
          />
          <div className="center-align mt-20">
            {!isInvestmentExperienceValid &&
              <p className="negative-text mb-20">
                NextSeed investments are suitable for experienced investors
                are comfortable with long-term risk.
                Please confirm that you fit this profile in order to proceed.
              </p>
            }
            <Button primary className="relaxed" content="Continue to Account" disabled={!(INVESTMENT_EXP_FORM.meta.isValid && isInvestmentExperienceValid)} />
            {!isInvestmentExperienceValid &&
              <p className="negative-text mt-20">
                Otherwise, please reference our <Link to="/app/resources/welcome-packet">Education Center </Link>
                to learn more about investing on NextSeed.
              </p>
            }
          </div>
        </Form>
      </Aux>
    );
  }
}
