import React, { Component } from 'react';
import { Header, Form, Divider, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup, FormArrowButton, MaskedInput } from '../../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;

@inject('entityAccountStore', 'uiStore')
@observer
export default class AccountType extends Component {
  handleSubmitAccount = () => {
    const { createAccount, stepToBeRendered } = this.props.entityAccountStore;
    const { multiSteps } = this.props.uiStore;
    createAccount(multiSteps[stepToBeRendered]);
  }

  handleOnClick = (e, { value }) => {
    if (value) {
      this.props.uiStore.addMoreInProgressArray('TRUST');
    } else {
      this.handleSubmitAccount();
    }
  }

  render() {
    const { TRUST_INFO_FRM, trustInfoChange, entityInfoDateChange } = this.props.entityAccountStore;
    const { inProgressArray } = this.props.uiStore;

    const isTrustSelected = inProgressArray.includes('TRUST'); // only for mobile screen
    const TrustDateInput = () => (
      <div className={isMobile ? '' : 'mt-60'}>
        <MaskedInput
          name="trustDate"
          fielddata={TRUST_INFO_FRM.fields.trustDate}
          format="##/##/####"
          changed={values => entityInfoDateChange(values.formattedValue)}
          dateOfBirth
          showerror
          placeHolder="MM/DD/YYYY"
        />
      </div>
    );
    return (
      <div>
        {!isTrustSelected && (
        <Header as="h4">Is this entity a trust?</Header>)
        }
        <Form error className={`${isMobile ? 'mb-30 mt-0' : ''} account-type-tab`}>
          <>
            {isTrustSelected
              ? (
                <>
                  <TrustDateInput />
                  <Divider hidden />
                  <Button fluid primary className="relaxed" content="Continue" disabled={!TRUST_INFO_FRM.meta.isValid} onClick={this.handleSubmitAccount} />
                </>
              )
              : (
                <>
                  {(isMobile) ? (
                    <FormArrowButton
                      fielddata={TRUST_INFO_FRM.fields.isTrust}
                      name="isTrust"
                      changed={
                        (e, result) => {
                          trustInfoChange(e, { fielddata: { ...result }, ...result });
                          this.handleOnClick(e, result);
                        }
                      }
                    />
                  ) : (
                      <>
                        <FormRadioGroup
                          fielddata={TRUST_INFO_FRM.fields.isTrust}
                          name="isTrust"
                          changed={trustInfoChange}
                          containerclassname={`${isMobile ? 'two wide' : ''} button-radio`}
                        />
                        {TRUST_INFO_FRM.fields.isTrust.value
                          && (
                            <>
                              <TrustDateInput />
                              <Divider hidden />
                            </>
                          )}
                        <Button primary className={`${!isMobile && 'mt-30'} relaxed`} content="Continue" disabled={!TRUST_INFO_FRM.meta.isValid} onClick={this.handleSubmitAccount} />
                      </>
                  )
                  }
                </>
              )
            }
          </>
        </Form>
      </div>
    );
  }
}
