import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Divider, Button } from 'semantic-ui-react';
import { ListErrors } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'PUBLIC_COMPANY_REL_FRM',
};

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'uiStore')
@observer
class PublicCompanyRel extends Component {
  componentWillUnmount() {
    this.props.uiStore.removeOneFromProgressArray('PUBLIC_COMPANY_REL');
  }

  handleShowFields = () => {
    this.props.uiStore.addMoreInProgressArray('PUBLIC_COMPANY_REL');
  }

  render() {
    const { PUBLIC_COMPANY_REL_FRM, upsertInvestorProfile, stepToBeRendered, resetForm } = this.props.investorProfileStore;
    const { errors, inProgressArray, multiSteps } = this.props.uiStore;
    const { smartElement } = this.props;
    if (inProgressArray.includes('PUBLIC_COMPANY_REL')) {
      return (
        <>
          <Form onSubmit={() => upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered])} error className={isMobile ? ' mb-30 center-align' : ''}>
            <div className={isMobile ? 'mt-30' : ''}>
              <Form.Group widths="equal">
                {smartElement.Input('publicCompanyTicker')}
              </Form.Group>
              <Button primary size="large" fluid={isMobile} className="mt-40 relaxed" content="Continue" disabled={!PUBLIC_COMPANY_REL_FRM.meta.isValid} />
            </div>
            {
              errors
              && (
                <Message error className="mt-30">
                  <ListErrors errors={errors.message ? [errors.message] : [errors]} />
                </Message>
              )
            }
          </Form>
        </>
      );
    }
    return (
      <>
        <Header as="h4">
          Are you (or an immediate family member) a 10% shareholder,
          director or senior officer at a publicly traded U.S. company?
        </Header>
        {!isMobile && <Divider hidden />}
        <p className="mb-40">If you do not know what this means, it likely does not apply to you</p>
        {!inProgressArray.includes('PUBLIC_COMPANY_REL')
          && (
            <>
              <Button basic onClick={() => { resetForm('PUBLIC_COMPANY_REL_FRM'); upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered]); }} fluid={isMobile} className={`${isMobile ? 'mb-20 relaxed' : ''} primary-hover`} content="No" />
              <Button basic className={`${!isMobile ? 'ml-10' : 'mlr-0'} primary-hover`} onClick={this.handleShowFields} content="Yes" fluid={isMobile} />
            </>
          )
        }
      </>
    );
  }
}
export default formHOC(PublicCompanyRel, metaInfo);
