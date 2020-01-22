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
    const { smartElement, investorProfileStore, uiStore } = this.props;
    const { PUBLIC_COMPANY_REL_FRM, upsertInvestorProfile, stepToBeRendered } = investorProfileStore;
    const { errors, inProgressArray, multiSteps } = uiStore;
    if (inProgressArray.includes('PUBLIC_COMPANY_REL') && isMobile) {
      return (
        <Form onSubmit={() => upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered])} error className="mb-30">
          <Form.Group widths="equal">
            {
              smartElement.Input('publicCompanyTicker')
            }
            <Button primary size="large" fluid className={`${isMobile ? 'mt-40' : ''} relaxed`} content="Continue" disabled={!PUBLIC_COMPANY_REL_FRM.meta.isValid} />
          </Form.Group>
        </Form>
      );
    }
    return (
      <div className={isMobile ? '' : 'center-align'}>
        {/* <Header as="h3">Public Company Relations</Header> */}
        <Header as="h3">
          Are you (or an immediate family member) a 10% shareholder,
                    director or senior officer at a publicly traded U.S. company?
        </Header>
        {!isMobile && <Divider hidden />}
        <p className="mb-40">If you do not know what this means, it likely does not apply to you</p>
        <Form error className={isMobile ? ' mb-30 center-align' : ''}>
          {/* <FormRadioGroup
            fielddata={PUBLIC_COMPANY_REL_FRM.fields.publicCompanyRel}
            name="publicCompanyRel"
            changed={(e, result) => {
              employmentChange(e, 'PUBLIC_COMPANY_REL_FRM', result);
              this.props.uiStore.scrollIntoActiveInputFields();
            }}
            containerclassname="three wide button-radio center-align"
            showerror
          /> */}
          {!inProgressArray.includes('PUBLIC_COMPANY_REL')
            && (
              <Button.Group vertical>
                <Button primary size="large" onClick={() => upsertInvestorProfile(multiSteps && multiSteps[stepToBeRendered])} fluid={isMobile} className={`${isMobile ? 'mb-30' : 'mb-20'} relaxed`} content="No" />
                <Button className="link-button" onClick={this.handleShowFields} color="green" content="Yes" />
              </Button.Group>
            )
          }
          {inProgressArray.includes('PUBLIC_COMPANY_REL') && !isMobile
            && (
              <div className={`${isMobile ? 'mt-30' : 'field-wrap'} left-align`}>
                <Form.Group widths="equal">
                  {
                    smartElement.Input('publicCompanyTicker')
                  }
                </Form.Group>
              </div>
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
export default formHOC(PublicCompanyRel, metaInfo);
