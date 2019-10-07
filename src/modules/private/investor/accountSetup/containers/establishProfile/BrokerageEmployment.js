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
    if (inProgressArray.includes('BROKERAGE_EMPLOYMENT') && isMobile) {
      return (
        <Form onSubmit={() => updateInvestorProfileData(multiSteps && multiSteps[stepToBeRendered])} error className="mb-30">
          <Form.Group widths="equal">
            <FormInput
              key="brokerageFirmName"
              fielddata={BROKERAGE_EMPLOYMENT_FORM.fields.brokerageFirmName}
              name="brokerageFirmName"
              changed={(e, result) => employmentChange(e, 'BROKERAGE_EMPLOYMENT_FORM', result)}
              showerror
            />
            <Button className={`${isMobile ? 'mt-60' : ''} relaxed`} primary size="large" fluid content="Continue" disabled={!BROKERAGE_EMPLOYMENT_FORM.meta.isValid} />
          </Form.Group>
        </Form>
      );
    }
    return (
      <div className={isMobile ? '' : 'center-align'}>
        {/* <Header as="h3">Brokerage employment</Header> */}
        <Header as="h4">Do you (or an immediate family member) work for a US-based securities brokerage firm?</Header>
        {!isMobile && <Divider hidden />}
        {/* <p>
          Do you (or an immediate family member) work for a US-based
          {' '}
          <Responsive as={Aux} minWidth={1200}><br /></Responsive>
securities brokerage firm?
        </p>
        <Divider hidden /> */}
        <p className="mb-40">If you do not know what this means, it likely does not apply to you.</p>
        <Form error className={isMobile ? ' mb-30 center-align' : ''}>
          {/* <FormRadioGroup
            fielddata={BROKERAGE_EMPLOYMENT_FORM.fields.brokerageEmployment}
            name="brokerageEmployment"
            changed={(e, result) => {
              employmentChange(e, 'BROKERAGE_EMPLOYMENT_FORM', result);
              this.props.uiStore.scrollIntoActiveInputFields();
            }}
            containerclassname="three wide button-radio center-align"
            showerror
          /> */}
          {!inProgressArray.includes('BROKERAGE_EMPLOYMENT')
          && (
            <Button.Group vertical>
            <Button primary size="large" onClick={() => updateInvestorProfileData(multiSteps && multiSteps[stepToBeRendered])} fluid={isMobile} className={`${isMobile ? 'mb-30' : 'mb-20'} relaxed`} content="No" />
            <Button className="link-button" onClick={this.handleShowFields} color="green" content="Yes" />
            </Button.Group>
          )
          }
          {inProgressArray.includes('BROKERAGE_EMPLOYMENT') && !isMobile
          && (
          <div className={`${isMobile ? 'mt-30' : 'field-wrap'} left-align`}>
            <Form.Group widths="equal">
              <FormInput
                key="brokerageFirmName"
                fielddata={BROKERAGE_EMPLOYMENT_FORM.fields.brokerageFirmName}
                name="brokerageFirmName"
                changed={(e, result) => employmentChange(e, 'BROKERAGE_EMPLOYMENT_FORM', result)}
                showerror
              />
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
