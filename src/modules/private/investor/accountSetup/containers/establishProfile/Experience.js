import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { FormCheckbox, FormArrowButton } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'userDetailsStore', 'uiStore')
@withRouter
@observer
export default class Experience extends Component {
  state = {
    errorMessage: '',
    ctaErrors: { for: '', errorMsg: '' },
  };

  handleSubmitInvestmentExperience = () => {
    const {
      INVESTMENT_EXP_FORM,
      updateInvestorProfileData,
      isValidInvestorProfileForm,
    } = this.props.investorProfileStore;
    if (INVESTMENT_EXP_FORM.meta.isValid
      && this.props.investorProfileStore.isInvExperienceValid) {
      if (isValidInvestorProfileForm) {
        this.props.uiStore.setErrors(undefined);
        const currentStep = {
          name: 'Investment Experience',
          form: 'INVESTMENT_EXP_FORM',
          stepToBeRendered: 6,
        };
        updateInvestorProfileData(currentStep).then(() => {
          const { signupStatus, userStatus, hasAnyAccount, getInvestorAccountsRoute } = this.props.userDetailsStore;
          if (signupStatus.isMigratedFullAccount
            || (userStatus && userStatus.includes('FULL'))) {
            if (hasAnyAccount) {
              const route = getInvestorAccountsRoute();
              this.props.history.push(`/dashboard/account-details/${route}/portfolio`);
            } else {
              this.props.history.push('/dashboard/setup');
            }
            setTimeout(() => this.props.uiStore.setProgress(false), 2000);
          } else {
            this.props.history.push('/dashboard/setup/account-creation');
          }
        });
      } else {
        const errorMessage = 'Investor Profile is not valid! Please complete all the steps.';
        this.setState({ errorMessage });
      }
    }
  }

  handleOnClick = (e, { value }) => {
    if (value === 'NONE') {
      this.setState({ ctaErrors: { for: value, errorMsg: 'NextSeed investments are suitable for experienced investors who are comfortable with long-term risk.' } });
    } else {
      this.props.uiStore.addMoreInProgressArray('EXPERIENCED');
      this.setState({ ctaErrors: { for: '', errorMsg: '' } });
    }
  }

  render() {
    const {
      INVESTMENT_EXP_FORM,
      isInvExperienceValid,
      experiencesChange,
    } = this.props.investorProfileStore;
    const { inProgressArray, errors } = this.props.uiStore;
    const { errorMessage } = this.state;
    const noExperience = INVESTMENT_EXP_FORM.fields.experienceLevel.value === 'NONE';
    const isExperiencedTypeSelected = inProgressArray.includes('EXPERIENCED'); // only for mobile screen
    const CheckBoxes = () => (
      <>
        {['isRiskTaker', 'isComfortable'].map(field => (
          <FormCheckbox
            fielddata={INVESTMENT_EXP_FORM.fields[field]}
            name={field}
            changed={experiencesChange}
            defaults
            containerclassname="ui relaxed list"
          />
        ))}
      </>
    );
    const RequestMsg = () => (
      <p className="negative-text mb-20">
        Please confirm that you fit this profile in order to proceed.
      </p>
    );
    return (
      <>
        <Header as="h4">
          {!isMobile ? 'Investment Experience' : isExperiencedTypeSelected ? 'Almost there!' : 'What is your investment experience?'
          }
        </Header>
        {!isMobile && (
          <p className="mb-40">
            Confirm your experience and understanding of the investment risks on NextSeed.
            Select the box that best describes your investment experience to date:
          </p>
        )}
        {isExperiencedTypeSelected && (
          <p className={`${isMobile ? 'mb-30' : ''} tertiary-text`}>
            We just need to confirm your understanding of the investment risks on NextSeed
          </p>
        )
        }
        <Form error={(!isInvExperienceValid && noExperience) || errors}>
          {isExperiencedTypeSelected ? (
            <CheckBoxes />
          )
            : (
              <FormArrowButton
                fielddata={INVESTMENT_EXP_FORM.fields.experienceLevel}
                name="experienceLevel"
                changed={
                  (e, result) => {
                    experiencesChange(e, result);
                    this.handleOnClick(e, result);
                  }
                }
                ctaErrors={this.state.ctaErrors}
              />
            )
          }
          {(errorMessage || errors)
            && (
              <Message error className="mt-20 display-block">
                <ListErrors errors={errors && errors.message ? [errors.message] : errorMessage !== '' ? [errorMessage] : ['']} />
              </Message>
            )
          }
          {!isMobile ? (
            <div className="mt-40">
              <Button primary className="relaxed" content="Continue to Account" disabled={!isInvExperienceValid || !INVESTMENT_EXP_FORM.meta.isValid} onClick={this.handleSubmitInvestmentExperience} />
              {!isInvExperienceValid && noExperience
                && (
                <p className="negative-text mt-20">
                  Otherwise, please reference our{' '}
                  <Link to="/resources/education-center/investor">Education Center </Link> to learn more about investing on NextSeed.
                </p>
                )}
            </div>
          ) : (
              <>
                {isExperiencedTypeSelected && (
                  <div className="mt-20">
                    <Button fluid primary className="relaxed" content="Create Account" disabled={!isInvExperienceValid || !INVESTMENT_EXP_FORM.meta.isValid} onClick={this.handleSubmitInvestmentExperience} />
                  </div>
                )}
                {isExperiencedTypeSelected && !isInvExperienceValid
                  && (<RequestMsg />)
                }
              </>
          )
          }
        </Form>
      </>
    );
  }
}
