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
    const { smartElement, uiStore, investorProfileStore } = this.props;
    const { BROKERAGE_EMPLOYMENT_FRM, upsertInvestorProfile, stepToBeRendered } = investorProfileStore;
    const { errors, multiSteps, inProgressArray } = uiStore;
    if (inProgressArray.includes('BROKERAGE_EMPLOYMENT') && isMobile) {
      return (
        <>
          <Form onSubmit={() => upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered])} error className="mb-30">
            <Form.Group widths="equal">
              {smartElement.Input('brokerageFirmName')}
              <Button className={`${isMobile ? 'mt-60' : ''} relaxed`} primary size="large" fluid content="Continue" disabled={!BROKERAGE_EMPLOYMENT_FRM.meta.isValid} />
            </Form.Group>
          </Form>
          <Divider section hidden className="mb-60" />
          <p className="note mobile-bottom-notes">
            You will not be able to make investments on NextSeed until we receive a 407 letter from your firm approving the opening of your account. Please ask your firm to send the letter to <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
          </p>
        </>
      );
    }
    return (
      <div className={isMobile ? '' : 'center-align'}>
        {/* <Header as="h3">Brokerage employment</Header> */}
        <Header as="h3">Do you (or an immediate family member) work for a US-based securities brokerage firm?</Header>
        {!isMobile && <Divider hidden />}
        {/* <p>
          Do you (or an immediate family member) work for a US-based
          {' '}
          <Responsive as={Aux} minWidth={1200}><br /></Responsive>
securities brokerage firm?
        </p>
        <Divider hidden /> */}
        <p className="mb-40">If you do not know what this means, it likely does not apply to you.</p>
        <Form error className={isMobile ? ' mb-30' : ''}>
          {/* <FormRadioGroup
            fielddata={BROKERAGE_EMPLOYMENT_FRM.fields.brokerageEmployment}
            name="brokerageEmployment"
            changed={(e, result) => {
              formChange(e, result, 'BROKERAGE_EMPLOYMENT_FRM');
              this.props.uiStore.scrollIntoActiveInputFields();
            }}
            containerclassname="three wide button-radio center-align"
            showerror
          /> */}
          {!inProgressArray.includes('BROKERAGE_EMPLOYMENT')
            && (
              <Button.Group vertical>
                <Button primary size="large" onClick={() => upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered])} fluid={isMobile} className={`${isMobile ? 'mb-30' : 'mb-20'} relaxed`} content="No" />
                <Button className="link-button" onClick={this.handleShowFields} color="green" content="Yes" />
              </Button.Group>
            )
          }
          {inProgressArray.includes('BROKERAGE_EMPLOYMENT') && !isMobile
            && (
              <>
                <div className={`${isMobile ? 'mt-30' : 'field-wrap'} left-align`}>
                  <Form.Group widths="equal">
                    {smartElement.Input('brokerageFirmName')}
                  </Form.Group>
                </div>
                <Divider section hidden />
                <p className="note">
                  You will not be able to make investments on NextSeed until we receive a 407 letter from your firm approving the opening of your account. Please ask your firm to send the letter to <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
              </p>
              </>
            )
          }
          {errors
            && (
              <Message error className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            )
          }
        </Form>
      </div>
    );
  }
}
export default formHOC(BrokerageEmployment, metaInfo);
