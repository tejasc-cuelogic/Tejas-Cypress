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

@inject('newBusinessStore', 'uiStore')
@observer
export default class PreQualification extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.newBusinessStore.businessPreQualification();
    const APP_STATUS = this.props.newBusinessStore.BUSINESS_APP_STATUS;
    if (APP_STATUS !== '') {
      Helper.toast('Business pre-qualification request submitted!', APP_STATUS);
      this.props.history.push(`/business-application/${APP_STATUS}`);
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
                fielddata={fields.businessType}
                name="businessType"
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
                      <div>
                        <FormInput
                          key="businessName"
                          name="businessName"
                          value={fields.businessName.value}
                          fielddata={fields.businessName}
                          changed={businessAppEleChange}
                        />
                        <MaskedInput2
                          name="businessZipCode"
                          fielddata={fields.businessZipCode}
                          changed={businessAppEleChange}
                          businessZipCode
                        />
                        <FormInput
                          key="webSite"
                          name="webSite"
                          value={fields.webSite.value}
                          fielddata={fields.webSite}
                          changed={businessAppEleChange}
                        />
                      </div>
                    }
                    <MaskedInput2
                      name="phoneNumber"
                      fielddata={fields.phoneNumber}
                      changed={businessAppEleChange}
                      phoneNumber
                    />
                    <FormInput
                      name="emailAddress"
                      value={fields.emailAddress.value}
                      fielddata={fields.emailAddress}
                      changed={businessAppEleChange}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    <Header as="h5">Business Address</Header>
                    <AutoComplete
                      name="businessStreet"
                      fielddata={fields.businessStreet}
                      onplaceselected={setAddressFields}
                      changed={businessAppEleChange}
                    />
                    <Form.Group widths="equal">
                      {
                        ['city', 'state', 'zipCode'].map(field => (
                          field !== 'zipCode' ? (
                            <FormInput
                              key={field}
                              type="text"
                              name={field}
                              fielddata={fields[field]}
                              changed={businessAppEleChange}
                            />) : (
                              <MaskedInput2
                                key={field}
                                name={field}
                                fielddata={fields[field]}
                                changed={businessAppEleChange}
                                zipCode
                              />)))
                      }
                    </Form.Group>
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap header="What industry are you in?" subHeader="Please select all that apply.">
              <FormCheckbox
                fielddata={fields.industryType}
                name="industryType"
                changed={businessAppEleChange}
                containerclassname="iconic-checkbox"
              />
            </FormElementWrap>
            <FormElementWrap header="What can NextSeed help you with?" subHeader="Select in which area NextSeed can help your business.">
              <FormRadioGroup
                fielddata={fields.businessHelp}
                name="businessHelp"
                changed={businessAppEleChange}
                iconic
                containerclassname="iconic-radio"
              />
            </FormElementWrap>
            <FormElementWrap header="Experience">
              <Grid>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['relatedExperience', 'estCreditScore'].map(field => (
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
                      ['projectCost', 'raiseRequired'].map(field => (
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
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['grossSales', 'goodsSold', 'operatingExpenses', 'netIncome'].map(field => (
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
            <FormCheckbox
              fielddata={fields.subscribeTo}
              name="subscribeTo"
              changed={businessAppEleChange}
              defaults
              containerclassname="ui relaxed list"
            />
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
