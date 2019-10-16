import React, { Component } from 'react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';
import { FormRadioGroup, FormArrowButton } from '../../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;

@inject('iraAccountStore', 'uiStore')
@observer
export default class Funding extends Component {
  getOptionDetails = () => {
    const { value, values } = this.props.iraAccountStore.FUNDING_FRM.fields.fundingType;
    return find(values, v => v.value === value) ? find(values, v => v.value === value).description : '';
  };

  handleArrowButtonClick = () => {
    const { createAccount, stepToBeRendered } = this.props.iraAccountStore;
    const { multiSteps } = this.props.uiStore;
    createAccount(multiSteps[stepToBeRendered]);
  }

  render() {
    const { FUNDING_FRM, fundingChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h4" textAlign={isMobile ? '' : 'center'}>How would you like to fund your [Traditional/Roth] IRA?</Header>
        {!isMobile
          && (
            <>
              <Divider hidden />
              <p className="center-align tertiary-text">Choose funding option</p>
              <Divider section hidden />
            </>
          )
        }
        <Form error className={isMobile ? '' : 'account-type-tab'}>
          {isMobile
            ? (
          <FormArrowButton
            fielddata={FUNDING_FRM.fields.fundingType}
            name="fundingType"
            changed={fundingChange}
            action={this.handleArrowButtonClick}
          />
            )
            : (
          <>
          <FormRadioGroup
            fielddata={FUNDING_FRM.fields.fundingType}
            name="fundingType"
            changed={fundingChange}
            containerclassname={`${isMobile ? 'two wide' : ''} button-radio center-align`}
          />
          <Divider section hidden />
          <div className={isMobile ? '' : 'option-details'}>
            {
              FUNDING_FRM.fields.fundingType.value === 0
                ? (
                <p className="mt-20 grey-header">
                  Set up a new self-directed IRA with
                  an initial deposit from an external checking account.
                  Annual contribution limits apply.
                  {/* <a target="_blank" rel="noopener noreferrer" href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits">Check the IRS website for the latest rules</a> */}
                </p>
                )
                : FUNDING_FRM.fields.fundingType.value === 1
                  ? (
                    <p className="mt-20 grey-header">
                      You can transfer funds from your current [Traditional/Roth] IRA
                      to set up your [Traditional/Roth] IRA account at NextSeed.
                      <br />
                      <br />
                      Note: With a transfer, funds can only be moved between like-types of IRAs.
                    </p>
                  )
                  : FUNDING_FRM.fields.fundingType.value === 2
                    ? (
                      <p className="mt-20 grey-header">
                        {'"'}
                        Roll over funds from your 401(k), 403(b), or another qualified account
                        to fund your NextSeed self-directed IRA
                      </p>
                    )
                    : ''
            }
          </div>
          <Divider section hidden />
          </>
            )
          }
        </Form>
      </div>
    );
  }
}
