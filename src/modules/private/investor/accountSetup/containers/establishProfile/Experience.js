import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { FormRadioGroup, FormCheckbox, FormArrowButton } from '../../../../../../theme/form';
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
      isInvestmentExperienceValid,
      experiencesChange,
      isValidInvestorProfileForm,
    } = this.props.investorProfileStore;
    const { inProgressArray } = this.props.uiStore;
    const { errorMessage } = this.state;
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
      <Header as="h4" textAlign={!isMobile ? 'center' : ''}>
        {!isMobile ? 'Investment Experience' : isExperiencedTypeSelected ? 'Almost there!' : 'Please select the box that best describes your investment experience'
        }
      </Header>
        {!isMobile && (
          <p className="center-align mb-40">
            Confirm your experience and understanding of the investment risks on NextSeed.
            Select the box that best describes your investment experience to date:
          </p>
        )}
        {isExperiencedTypeSelected && (
          <p className="tertiary-text">
            We just need to confirm your understanding of the investment risks on NextSeed
          </p>
        )
        }
        <Form error={!isInvestmentExperienceValid}>
          {isExperiencedTypeSelected ? (
          <CheckBoxes />
          )
            : (
        <>
          {isMobile
            ? (
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
            ) : (
          <>
          <FormRadioGroup
            fielddata={INVESTMENT_EXP_FORM.fields.experienceLevel}
            name="experienceLevel"
            changed={experiencesChange}
            containerclassname="two wide button-radio center-align mb-50"
            showerror
          />
          <CheckBoxes />
          </>
            )
            }
          </>
            )
          }
          {errorMessage
          && (
<Message error className="mt-20">
            <ListErrors errors={errorMessage ? [errorMessage] : ['']} />
          </Message>
          )
          }
          {!isMobile ? (
          <div className="center-align mt-20">
            {!isInvestmentExperienceValid
              && (
              <p className="negative-text mb-20">
                NextSeed investments are suitable for experienced investors who are comfortable
                with long-term risk.
              </p>
              )
            }
            <Button fluid={isMobile} primary className="relaxed" content="Continue to Account" disabled={!isValidInvestorProfileForm} onClick={this.handleSubmitInvestmentExperience} />
            {!isInvestmentExperienceValid
              && (<RequestMsg />)
            }
          </div>
          ) : (
            <>
            {isExperiencedTypeSelected && (
            <div className="center-align mt-20">
              <Button fluid={isMobile} primary className="relaxed" content="Create Account" disabled={!isValidInvestorProfileForm} onClick={this.handleSubmitInvestmentExperience} />
            </div>
            )}
            {isExperiencedTypeSelected && !isInvestmentExperienceValid
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
