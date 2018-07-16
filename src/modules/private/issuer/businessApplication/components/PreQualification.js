import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Grid, Icon, Form, Button, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../../helper/utility';
import {
  FormRadioGroup, FormCheckbox, FormInput, MaskedInput2, AutoComplete,
} from '../../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import { BUSINESS_GOAL } from '../../../../../services/constants/newBusiness';

@inject('newBusinessStore', 'uiStore')
@observer
export default class PreQualification extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.newBusinessStore.businessPreQualification();
    const APP_STATUS = this.props.newBusinessStore.BUSINESS_APP_STATUS;
    if (APP_STATUS !== '') {
      Helper.toast('Business pre-qualification request submitted!', APP_STATUS);
      // this.props.history.push(`/business-application/${APP_STATUS}`);
    }
  }
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange, setAddressFields,
    } = this.props.newBusinessStore;
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
                  <Link target="_blank" to="/about/faq" className="link"> Need help or have questions?</Link>
                </Aux>
              }
            />
            <FormElementWrap
              header="What is your Business Model?"
              subHeader="Only Business to Consumer models are accepted at this time"
            >
              <FormRadioGroup
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
                    <FormInput
                      name="businessName"
                      value={fields.businessName.value}
                      fielddata={fields.businessName}
                      changed={businessAppEleChange}
                    />
                    <Header as="h5">Business Address</Header>
                    <AutoComplete
                      name="street"
                      fielddata={fields.street}
                      onplaceselected={setAddressFields}
                      changed={businessAppEleChange}
                    />
                    <Form.Group widths="equal">
                      {
                        ['city', 'state', 'zipCode'].map(field => (
                          <FormInput
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
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    <FormInput
                      name="website"
                      value={fields.website.value}
                      fielddata={fields.website}
                      changed={businessAppEleChange}
                    />
                    <MaskedInput2
                      name="phoneNumber"
                      fielddata={fields.phoneNumber}
                      changed={businessAppEleChange}
                    />
                    <FormInput
                      name="email"
                      value={fields.email.value}
                      fielddata={fields.email}
                      changed={businessAppEleChange}
                    />
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap header="What industry are you in?" subHeader="Please select all that apply.">
              <FormCheckbox
                fielddata={fields.industryTypes}
                name="industryTypes"
                changed={businessAppEleChange}
                containerclassname="iconic-checkbox"
              />
            </FormElementWrap>
            <FormElementWrap header="What can NextSeed help you with?" subHeader="Select in which area NextSeed can help your business.">
              <FormRadioGroup
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
                    {fields.businessGoal.value &&
                      fields.businessGoal.value === BUSINESS_GOAL.FRANCHISE &&
                      <Aux>
                        <Header as="h5" content="Are you an existing or previous franchise holder?" />
                        <FormRadioGroup
                          fielddata={fields.franchiseHolder}
                          name="franchiseHolder"
                          changed={businessAppEleChange}
                          containerclassname="button-radio"
                        />
                        <Divider section hidden />
                      </Aux>
                    }
                    {fields.businessGoal.value &&
                      fields.businessGoal.value !== BUSINESS_GOAL.FRANCHISE
                      && fields.businessGoal.value !== BUSINESS_GOAL.BRAND_NEW &&
                      <Aux>
                        <Header as="h5" content="How long has the existing business been operating?" />
                        <Form.Group widths="equal">
                          {
                            ['businessAgeYears', 'businessAgeMonths'].map(field => (
                              <FormInput
                                key={field}
                                name={field}
                                value={fields[field].value}
                                fielddata={fields[field]}
                                changed={businessAppEleChange}
                              />
                            ))
                          }
                        </Form.Group>
                        <Divider section hidden />
                      </Aux>
                    }
                    {
                      ['industryExperience', 'estimatedCreditScore'].map(field => (
                        <FormInput
                          key={field}
                          name={field}
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                    {
                      ['totalProjectCost', 'amountNeeded'].map(field => (
                        <MaskedInput2
                          key={field}
                          name={field}
                          currency
                          tooltip={fields[field].tooltip}
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap header="What will the funds be used for?" subHeader="Please select all that apply.">
              <FormCheckbox
                fielddata={fields.fundUsage}
                name="fundUsage"
                changed={businessAppEleChange}
                containerclassname="iconic-checkbox"
              />
            </FormElementWrap>
            <FormElementWrap
              header="Next year projections"
              subHeader="For your business, give us a quick snapshot of what the next year will look like."
            >
              <Grid>
                {fields.businessGoal.value &&
                  fields.businessGoal.value !== BUSINESS_GOAL.FRANCHISE
                    && fields.businessGoal.value !== BUSINESS_GOAL.BRAND_NEW &&
                    <Grid.Column
                      widescreen={7}
                      largeScreen={7}
                      computer={8}
                      tablet={16}
                      mobile={16}
                    >
                      <div className="field-wrap">
                        {
                          ['previousYearGrossSales', 'previousYearCogSold', 'previousYearOperatingExpenses', 'previousYearNetIncome'].map(field => (
                            <MaskedInput2
                              key={field}
                              name={field}
                              currency
                              value={fields[field].value}
                              fielddata={fields[field]}
                              changed={businessAppEleChange}
                            />
                          ))
                        }
                      </div>
                    </Grid.Column>
                }
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['nextYearGrossSales', 'nextYearCogSold', 'nextYearOperatingExpenses', 'nextYearNetIncome'].map(field => (
                        <MaskedInput2
                          key={field}
                          name={field}
                          currency
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap header="What is your company’s entity structure?">
              <FormRadioGroup
                fielddata={fields.entityStructure}
                name="entityStructure"
                changed={businessAppEleChange}
                iconic
                containerclassname="iconic-radio"
              />
            </FormElementWrap>
            <FormElementWrap
              header="Legal Confirmation"
              subHeader="Please check all that apply.
                Note some of these items are not disqualifying conditions, but a NextSeed
                representative may follow up to verify any applicable details"
            >
              <FormCheckbox
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
