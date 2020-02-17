import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Message, Divider, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { ListErrors } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'FINANCIAL_INFO_FRM',
};

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'uiStore')
@withRouter
@observer
class Finances extends Component {
  render() {
    const { smartElement, investorProfileStore, uiStore } = this.props;
    const {
      stepToBeRendered, formChange, FINANCIAL_INFO_FRM, upsertInvestorProfile,
    } = investorProfileStore;
    const { errors, multiSteps } = uiStore;
    return (
      <>
        <Header as="h4">What is your household{"'"}s annual income and net worth?</Header>
        <p className={`${isMobile ? 'mb-30' : ''} tertiary-text`}>
          SEC rules and regulations require broker-dealers to collect this information
          to determine investor suitability for private offerings.
        </p>
        {!isMobile && <Divider hidden />}
        <Form error>
          {
            smartElement.RadioGroup('taxFilingAs', {
              changed: (e, result) => {
                formChange(e, result, 'FINANCIAL_INFO_FRM');
                this.props.uiStore.scrollIntoActiveInputFields();
              },
              containerclassname: 'three wide button-radio center-align',
            })
          }
          <Divider hidden />
          <Form.Group widths={2} className="mt-40">
            {['netWorth', 'annualIncomeCurrentYear'].map(field => (
              smartElement.Input(field)
            ))}
          </Form.Group>
          {errors
            && (
              <Message error className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            )
          }
        </Form>
        <p className="tertiary-text note mt-30 mb-40">
          We will never share your personal information with third parties without your consent
        </p>
       <Button primary onClick={() => upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered])} fluid={isMobile} className="relaxed" disabled={!FINANCIAL_INFO_FRM.meta.isValid} content="Continue" />
      </>
    );
  }
}
export default formHOC(Finances, metaInfo);
