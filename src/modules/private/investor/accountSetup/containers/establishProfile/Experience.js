import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Header, Form, Message, Button } from 'semantic-ui-react';
import { ListErrors } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'INVESTMENT_EXP_FRM',
};

@inject('investorProfileStore', 'userDetailsStore', 'uiStore')
@withRouter
@observer
class Experience extends Component {
  state = { errorMessage: '' };

  handleContinue = async () => {
    const currentStep = {
      form: 'INVESTMENT_EXP_FRM',
      stepToBeRendered: 6,
    };
    await this.props.investorProfileStore.upsertInvestorProfile(currentStep);
    const { signupStatus, userStatus } = this.props.userDetailsStore;
    if (signupStatus.isMigratedFullAccount
      || (userStatus && userStatus.includes('FULL'))) {
      this.props.history.push('/app/summary');
      setTimeout(() => this.props.uiStore.setProgress(false), 2000);
    } else {
      this.props.history.push('/app/summary/account-creation');
    }
  }

  render() {
    const { errorMessage } = this.state;
    const { smartElement, investorProfileStore } = this.props;
    const { isInvestmentExperienceValid, INVESTMENT_EXP_FRM } = investorProfileStore;
    const noExperience = INVESTMENT_EXP_FRM.fields.experienceLevel.value === 'NONE';
    return (
      <>
        <Header as="h3" textAlign="center">Investment Experience</Header>
        <p className="center-align mb-40">
          Confirm your experience and understanding of the investment risks on NextSeed.
          Select the box that best describes your investment experience to date:
        </p>
        <Form error onSubmit={this.handleContinue}>
          {
            smartElement.RadioGroup('experienceLevel', {
              containerclassname: 'two wide button-radio center-align mb-50',
            })
          }

          {
            ['isRiskTaker', 'isComfortable'].map(field => (
              smartElement.FormCheckBox(field)
            ))
          }
          {errorMessage
            && (
              <Message error className="mt-20">
                <ListErrors errors={errorMessage ? [errorMessage] : ['']} />
              </Message>
            )
          }
          <div className="center-align mt-20">
            {(!isInvestmentExperienceValid && noExperience)
              && (
                <p className="negative-text mb-20">
                  NextSeed investments are suitable for experienced investors who are
                  comfortable with long-term risk. Please confirm that you fit this
                  profile in order to proceed.
              </p>
              )
            }
            <Button primary className="relaxed" content="Continue to Account" disabled={!isInvestmentExperienceValid} />
            {(!isInvestmentExperienceValid && noExperience)
              && (
                <p className="negative-text mt-20">
                  Otherwise, please reference our <Link to="/resources/education-center">Education Center</Link> to
                  learn more about investing on NextSeed.
              </p>
              )
            }
          </div>
        </Form>
      </>
    );
  }
}
export default formHOC(Experience, metaInfo);
