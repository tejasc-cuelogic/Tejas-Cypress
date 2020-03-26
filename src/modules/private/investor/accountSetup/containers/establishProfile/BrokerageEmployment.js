import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Divider, Button } from 'semantic-ui-react';
import { ListErrors } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'BROKERAGE_EMPLOYMENT_FRM',
};

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'uiStore')
@observer
class BrokerageEmployment extends Component {
  componentWillUnmount() {
    this.props.uiStore.removeOneFromProgressArray('BROKERAGE_EMPLOYMENT');
  }

  handleShowFields = () => {
    this.props.uiStore.addMoreInProgressArray('BROKERAGE_EMPLOYMENT');
  }

  render() {
    const { smartElement } = this.props;
    const { BROKERAGE_EMPLOYMENT_FRM, upsertInvestorProfile, resetForm, stepToBeRendered } = this.props.investorProfileStore;
    const { errors, multiSteps, inProgressArray } = this.props.uiStore;
    if (inProgressArray.includes('BROKERAGE_EMPLOYMENT')) {
      return (
        <>
          <Form onSubmit={() => upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered])} error className={isMobile ? ' mb-30' : ''}>
            <Form.Group widths="equal">
              {smartElement.Input('brokerageFirmName')}
            </Form.Group>
            <Button className={`${isMobile ? 'mt-60' : 'mt-30'} relaxed`} primary size="large" fluid={isMobile} content="Continue" disabled={!BROKERAGE_EMPLOYMENT_FRM.meta.isValid} />
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
        <Button basic onClick={() => { resetForm('BROKERAGE_EMPLOYMENT_FRM'); upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered]); }} fluid={isMobile} className={`${isMobile ? 'mb-20 relaxed' : ''} primary-hover`} content="No" />
        <Button basic className={`${!isMobile ? 'ml-10' : 'mlr-0'} primary-hover`} onClick={this.handleShowFields} fluid={isMobile} content="Yes" />
      </>
    );
  }
}
export default formHOC(BrokerageEmployment, metaInfo);
