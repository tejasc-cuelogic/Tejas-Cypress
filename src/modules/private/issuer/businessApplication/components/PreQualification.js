import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Grid, Icon, Form, Button, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../../helper/utility';
import {
  FormRadioGroup, FormCheckbox, FormInput, MaskedInput, AutoComplete,
} from '../../../../../theme/form';
import FormElementWrap from './FormElementWrap';

@inject('businessAppStore', 'uiStore')
@observer
export default class PreQualification extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.businessPreQualificationFormSumbit().then(() => {
      const url = this.props.businessAppStore.BUSINESS_APP_STEP_URL;
      Helper.toast('Business pre-qualification request submitted!', 'success');
      this.props.history.push(`/app/business-application/${url}`);
    });
  }
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange, setAddressFields,
      businessAppEleMaskChange, getFranchiseCondition,
      getBusinessTypeCondtion,
      preQualFormDisabled,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_APP_FRM;
    return (
      <Grid container>
        <Grid.Column>
          <Form onSubmit={this.submit} className="issuer-signup">
            <Icon className="ns-paper-plane" size="massive" color="green" />
            <FormElementWrap
              as="h1"
              header="Pre-Qualification Application Process"
              subHeader={
                <Aux>
                  Welcome to NextSeed! Run through this quick form to get pre-qualified.
                  <Link target="_blank" to="/about/faq" className="link">Need help or have questions?</Link>
                </Aux>
              }
            />
            <FormElementWrap
              header="What is your Business Model?"
              subHeader="Only Business to Consumer models are accepted at this time."
            >
              <FormRadioGroup
                disabled={preQualFormDisabled}
                fielddata={fields.businessModel}
                name="businessModel"
                iconic
                changed={businessAppEleChange}
                containerclassname="button-radio"
              />
            </FormElementWrap>
            <FormElementWrap header="General Information">
              <Grid>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['businessName', 'website'].map(field => (
                        <FormInput
                          disabled={preQualFormDisabled}
                          key={field}
                          type="text"
                          name={field}
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                    <MaskedInput
                      disabled={preQualFormDisabled}
                      name="phoneNumber"
                      fielddata={fields.phoneNumber}
                      changed={businessAppEleMaskChange}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    <Header as="h6">Business Address</Header>
                    <AutoComplete
                      disabled={preQualFormDisabled}
                      name="street"
                      fielddata={fields.street}
                      onplaceselected={setAddressFields}
                      changed={businessAppEleChange}
                    />
                    <Form.Group widths="equal">
                      {
                        ['city', 'state', 'zipCode'].map(field => (
                          <FormInput
                            disabled={preQualFormDisabled}
                            key={field}
                            type="text"
                            name={field}
                            fielddata={fields[field]}
                            changed={businessAppEleChange}
                          />
                        ))
                      }
                    </Form.Group>
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap header="What industry are you in?" subHeader="Please select all that apply.">
              <FormCheckbox
                disabled={preQualFormDisabled}
                fielddata={fields.industryTypes}
                name="industryTypes"
                changed={businessAppEleChange}
                containerclassname="iconic-checkbox"
              />
            </FormElementWrap>
            <FormElementWrap header="What can NextSeed help you with?" subHeader="Select in which area NextSeed can help your business.">
              <FormRadioGroup
                disabled={preQualFormDisabled}
                fielddata={fields.businessGoal}
                name="businessGoal"
                changed={businessAppEleChange}
                iconic
                containerclassname="iconic-radio"
              />
            </FormElementWrap>
            <FormElementWrap header="Experience">
              <Grid>
                <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {getFranchiseCondition &&
                      <Aux>
                        <Header as="h6" content="Are you an existing or previous franchise holder?" />
                        <FormRadioGroup
                          disabled={preQualFormDisabled}
                          fielddata={fields.franchiseHolder}
                          name="franchiseHolder"
                          changed={businessAppEleChange}
                          containerclassname="button-radio"
                        />
                        <Divider section hidden />
                      </Aux>
                    }
                    {getBusinessTypeCondtion &&
                      <Aux>
                        <Header as="h6" content="How long has the existing business been operating?" />
                        <Form.Group widths="equal">
                          {
                            ['businessAgeYears', 'businessAgeMonths'].map(field => (
                              <MaskedInput
                                disabled={preQualFormDisabled}
                                key={field}
                                name={field}
                                number
                                value={fields[field].value}
                                fielddata={fields[field]}
                                changed={businessAppEleMaskChange}
                              />
                            ))
                          }
                        </Form.Group>
                        <Divider section hidden />
                      </Aux>
                    }
                    {
                      ['industryExperience', 'estimatedCreditScore'].map(field => (
                        <MaskedInput
                          disabled={preQualFormDisabled}
                          key={field}
                          name={field}
                          number
                          tooltip={fields[field].tooltip}
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleMaskChange}
                        />
                      ))
                    }
                    {
                      ['totalProjectCost', 'amountNeeded'].map(field => (
                        <MaskedInput
                          hoverable
                          disabled={preQualFormDisabled}
                          key={field}
                          prefix="$ "
                          name={field}
                          currency
                          tooltip={fields[field].tooltip}
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleMaskChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap header="What will the funds be used for?" subHeader="Please select all that apply.">
              <FormCheckbox
                disabled={preQualFormDisabled}
                fielddata={fields.fundUsage}
                name="fundUsage"
                changed={businessAppEleChange}
                containerclassname="iconic-checkbox"
              />
            </FormElementWrap>
            <FormElementWrap>
              <Grid>
                {getBusinessTypeCondtion &&
                  <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
                    <Header as="h3">
                      Previous year
                      <Header.Subheader>
                        For your business, give us a quick snapshot
                        of what the prior year looked like.
                      </Header.Subheader>
                    </Header>
                    <div className="field-wrap">
                      {
                        ['previousYearGrossSales', 'previousYearCogSold', 'previousYearOperatingExpenses', 'previousYearNetIncome'].map(field => (
                          <MaskedInput
                            disabled={preQualFormDisabled}
                            key={field}
                            name={field}
                            prefix="$ "
                            currency
                            value={fields[field].value}
                            fielddata={fields[field]}
                            changed={businessAppEleMaskChange}
                          />
                        ))
                      }
                    </div>
                  </Grid.Column>
                }
                <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
                  <Header as="h3">
                    Next year projections
                    <Header.Subheader>
                      For your business, give us a quick snapshot
                      of what the next year will look like.
                    </Header.Subheader>
                  </Header>
                  <div className="field-wrap">
                    {
                      ['nextYearGrossSales', 'nextYearCogSold', 'nextYearOperatingExpenses', 'nextYearNetIncome'].map(field => (
                        <MaskedInput
                          disabled={preQualFormDisabled}
                          key={field}
                          name={field}
                          prefix="$ "
                          currency
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleMaskChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap header="What is your company’s entity structure?">
              <FormRadioGroup
                disabled={preQualFormDisabled}
                fielddata={fields.businessEntityStructure}
                name="businessEntityStructure"
                changed={businessAppEleChange}
                iconic
                containerclassname="iconic-radio"
              />
            </FormElementWrap>
            <FormElementWrap
              header="Legal Confirmation"
              subHeader="Please check all that apply.
                Note some of these items are not disqualifying conditions, but a NextSeed
                representative may follow up to verify any applicable details."
            >
              <FormCheckbox
                disabled={preQualFormDisabled}
                fielddata={fields.legalConfirmation}
                name="legalConfirmation"
                changed={businessAppEleChange}
                defaults
                containerclassname="ui relaxed list"
              />
            </FormElementWrap>
            <Divider hidden />
            <Button
              loading={this.props.uiStore.inProgress}
              disabled={!BUSINESS_APP_FRM.meta.isValid}
              size="large"
              color="green"
              className="very relaxed"
            >
              Submit
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
