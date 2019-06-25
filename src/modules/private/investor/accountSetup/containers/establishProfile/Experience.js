import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { FormRadioGroup, FormCheckbox } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'userDetailsStore', 'uiStore')
@withRouter
@observer
export default class Experience extends Component {
  state = { errorMessage: '' };

  handleSubmitInvestmentExperience = () => {
    const {
      validateInvestmentExperience,
      INVESTMENT_EXP_FORM,
      updateInvestorProfileData,
      isValidInvestorProfileForm,
    } = this.props.investorProfileStore;
    validateInvestmentExperience();
    if (INVESTMENT_EXP_FORM.meta.isValid
      && this.props.investorProfileStore.isInvestmentExperienceValid) {
      if (isValidInvestorProfileForm) {
        this.props.uiStore.setErrors(undefined);
        const currentStep = {
          name: 'Investment Experience',
          form: 'INVESTMENT_EXP_FORM',
          stepToBeRendered: 6,
        };
        updateInvestorProfileData(currentStep).then(() => {
          const { signupStatus, userStatus } = this.props.userDetailsStore;
          if (signupStatus.isMigratedFullAccount
            || (userStatus && userStatus.includes('FULL'))) {
            this.props.history.push('/app/summary');
            setTimeout(() => this.props.uiStore.setProgress(false), 2000);
          } else {
            this.props.history.push('/app/summary/account-creation');
          }
        });
      } else {
        const errorMessage = 'Investor Profile is not valid! Please complete all the steps.';
        this.setState({ errorMessage });
      }
    }
  }

  render() {
    const {
      INVESTMENT_EXP_FORM,
      isInvestmentExperienceValid,
      experiencesChange,
      isValidInvestorProfileForm,
    } = this.props.investorProfileStore;
    const { errorMessage } = this.state;
    return (
      <Aux>
        {
          !isMobile ? <Header as="h3" textAlign="center">Investment Experience</Header>
            : <Header as="h4">Please select the box that best describes your investment experience</Header>
        }
        {!isMobile && (
          <p className="center-align mb-40">
            Confirm your experience and understanding of the investment risks on NextSeed.
            Select the box that best describes your investment experience to date:
          </p>
        )}
        <Form error={!isInvestmentExperienceValid} onSubmit={this.handleSubmitInvestmentExperience}>
          <FormRadioGroup
            fielddata={INVESTMENT_EXP_FORM.fields.experienceLevel}
            name="experienceLevel"
            changed={experiencesChange}
            containerclassname="two wide button-radio center-align mb-50"
            showerror
          />
          <FormCheckbox
            fielddata={INVESTMENT_EXP_FORM.fields.isRiskTaker}
            name="isRiskTaker"
            changed={experiencesChange}
            defaults
            containerclassname="ui relaxed list"
          />
          <FormCheckbox
            fielddata={INVESTMENT_EXP_FORM.fields.isComfortable}
            name="isComfortable"
            changed={experiencesChange}
            defaults
            containerclassname="ui relaxed list"
          />
          {errorMessage
          && (
          <Message error className="mt-20">
            <ListErrors errors={errorMessage ? [errorMessage] : ['']} />
          </Message>
          )
          }
          <div className={`${isMobile ? '' : 'center-align'} mt-20`}>
            {!isInvestmentExperienceValid
              && (
              <p className="negative-text mb-20">
                NextSeed investments are suitable for experienced investors who are comfortable
                with long-term risk.
              </p>
              )
            }
            <Button fluid={isMobile} primary className="relaxed" content="Continue to Account" disabled={!isValidInvestorProfileForm} />
            {!isInvestmentExperienceValid
              && (
                // <p className="negative-text mt-20">
                // Otherwise, please reference our
                // {' '}
                // <Link to="/resources/education-center">Education Center</Link>
                // {' '}
                // to
                // learn more about investing on NextSeed.
                // </p>
                <p className="negative-text mt-20">
                  Please confirm that you fit this profile in order to proceed.
                </p>
              )
            }
          </div>
        </Form>
      </Aux>
    );
  }
}
