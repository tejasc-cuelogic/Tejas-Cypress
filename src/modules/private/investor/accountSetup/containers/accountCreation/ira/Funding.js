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
        <Header as="h3" textAlign={isMobile ? 'mb-20' : 'center'}>How would you like to fund your [Traditional/Roth] IRA?</Header>
        {!isMobile && <Divider section hidden />}
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
          {!isMobile && <Divider section hidden />}
          <div className={isMobile ? '' : 'option-details'}>
            {
              FUNDING_FRM.fields.fundingType.value === 0
                ? (
                <p className="grey-header">
                  Link an external checking account;<br />annual contribution limits apply
                </p>
                )
                : FUNDING_FRM.fields.fundingType.value === 1
                  ? (
                    <p className="grey-header">
                      Transfer funds from an existing like-type IRA account
                    </p>
                  )
                  : FUNDING_FRM.fields.fundingType.value === 2
                    ? (
                      <p className="grey-header">
                        Roll over funds from your 401(k), 403(b), or other qualified account
                      </p>
                    )
                    : ''
            }
          </div>
          </>
            )
          }
        </Form>
      </div>
    );
  }
}
