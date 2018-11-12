import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';
import { FormRadioGroup } from '../../../../../../../theme/form';

@inject('iraAccountStore')
@observer
export default class Funding extends Component {
  getOptionDetails = () => {
    const { value, values } = this.props.iraAccountStore.FUNDING_FRM.fields.fundingType;
    return find(values, v => v.value === value) ? find(values, v => v.value === value).description : '';
  };
  render() {
    const { FUNDING_FRM, fundingChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">How would you like to fund your IRA?</Header>
        <p className="center-align">Choose funding option</p>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={FUNDING_FRM.fields.fundingType}
            name="fundingType"
            changed={fundingChange}
            containerclassname="button-radio center-align"
          />
          <div className="option-details">
            {
              FUNDING_FRM.fields.fundingType.value === 0 ?
                <p className="mt-20">
                  Set up a new self-directed IRA with
                  an initial deposit from an external checking account.
                  Annual contribution limits apply.
                  {/* <a target="_blank" rel="noopener noreferrer" href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits">Check the IRS website for the latest rules</a> */}
                </p>
                :
                FUNDING_FRM.fields.fundingType.value === 1 ?
                  <p className="mt-20">
                    You can transfer funds from your current [Traditional/Roth] IRA
                    to set up your [Traditional/Roth]IRA account at NextSeed.<br /><br />
                    Note: With a transfer, funds can only be moved between like-types of IRAs.
                  </p>
                :
                FUNDING_FRM.fields.fundingType.value === 2 ?
                  <p className="mt-20" >
                    {'"'}Roll over funds from your 401(k), 403(b), or another qualified account
                    to fund your NextSeed self-directed IRA
                  </p>
                :
                ''
            }
          </div>
        </Form>
      </div>
    );
  }
}
