import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Divider, Button } from 'semantic-ui-react';
import { FormInput } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'uiStore')
@observer
export default class BrokerageEmployment extends Component {
  componentWillUnmount() {
    this.props.uiStore.removeOneFromProgressArray('BROKERAGE_EMPLOYMENT');
  }

  handleShowFields = () => {
    this.props.uiStore.addMoreInProgressArray('BROKERAGE_EMPLOYMENT');
  }

  render() {
    const { BROKERAGE_EMPLOYMENT_FORM, employmentChange, updateInvestorProfileData, stepToBeRendered } = this.props.investorProfileStore;
    const { errors, multiSteps, inProgressArray } = this.props.uiStore;
    if (inProgressArray.includes('BROKERAGE_EMPLOYMENT')) {
      return (
        <>
          <Form onSubmit={() => updateInvestorProfileData(multiSteps && multiSteps[stepToBeRendered])} error className={isMobile ? ' mb-30' : ''}>
            <Form.Group widths="equal">
              <FormInput
                key="brokerageFirmName"
                fielddata={BROKERAGE_EMPLOYMENT_FORM.fields.brokerageFirmName}
                name="brokerageFirmName"
                changed={(e, result) => employmentChange(e, 'BROKERAGE_EMPLOYMENT_FORM', result)}
                showerror
              />
            </Form.Group>
            <Button className={`${isMobile ? 'mt-60' : 'mt-30'} relaxed`} primary size="large" fluid={isMobile} content="Continue" disabled={!BROKERAGE_EMPLOYMENT_FORM.meta.isValid} />
            <Divider section hidden />
            {!isMobile
              && (
                <p className="note">
                  You will not be able to make investments on NextSeed until we receive a 407 letter from your firm approving the opening of your account. Please ask your firm to send the letter to <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
                </p>
              )}
          </Form>
          {errors && (
            <Message error className="mt-30">
              <ListErrors errors={errors.message ? [errors.message] : [errors]} />
            </Message>
          )
          }
        </>
      );
    }
    return (
      <>
        <Header as="h4">Do you (or an immediate family member) work for a US-based securities brokerage firm?</Header>
        {!isMobile && <Divider hidden />}
        <p className="mb-40">If you do not know what this means, it likely does not apply to you.</p>
        <Button.Group vertical={isMobile}>
          <Button basic onClick={() => updateInvestorProfileData(multiSteps && multiSteps[stepToBeRendered])} fluid={isMobile} className={`${isMobile ? 'mb-30 relaxed' : ''} primary-hover`} content="No" />
          <Button basic className={`${!isMobile && 'ml-10'} primary-hover`} onClick={this.handleShowFields} content="Yes" />
        </Button.Group>
      </>
    );
  }
}
