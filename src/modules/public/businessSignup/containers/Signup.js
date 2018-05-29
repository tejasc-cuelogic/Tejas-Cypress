import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Grid, Icon, Header, Divider, Form, Checkbox } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { FormRadioGroup, FormInput, MaskedInput, AutoComplete } from '../../../../theme/form/FormElements';

@inject('newBusinessStore')
@observer
class Signup extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange,
    } = this.props.newBusinessStore;
    return (
      <Segment vertical className="content">
        <Grid container>
          <Grid.Column>
            <Form className="issuer-signup">
              <Icon className="ns-paper-plane" size="huge" color="green" />
              <Header as="h1">
                Pre-Qualification Application Process
                <Header.Subheader>
                  Welcome to NextSeed! Run through this quick form to get pre-qualified.{' '}
                  <Link to="/" className="link">Need help or have questions?</Link>
                </Header.Subheader>
              </Header>
              <Divider section className="doubled" />
              <Header as="h2">
                What is your Business Model?
                <Header.Subheader>
                  Only Business to Consumer models are accepted at this time
                </Header.Subheader>
              </Header>
              <FormRadioGroup
                fielddata={BUSINESS_APP_FRM.fields.businessType}
                name="businessType"
                changed={businessAppEleChange}
                containerclassname="button-radio"
              />
              <Divider section className="doubled" />
              <Header as="h2">General Information</Header>
              <Grid>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['businessName', 'businessZipCode', 'webSite'].map(field => (
                        <FormInput
                          key={field}
                          name={field}
                          value={BUSINESS_APP_FRM.fields[field].value}
                          fielddata={BUSINESS_APP_FRM.fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                    <MaskedInput
                      name="phoneNumber"
                      fielddata={BUSINESS_APP_FRM.fields.phoneNumber}
                      mask="(999)-999-999"
                      changed={businessAppEleChange}
                    />
                    <FormInput
                      name="emailAddress"
                      value={BUSINESS_APP_FRM.fields.emailAddress.value}
                      fielddata={BUSINESS_APP_FRM.fields.emailAddress}
                      changed={businessAppEleChange}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    <Header as="h5">Business Address</Header>
                    <AutoComplete
                      name="businessStreet"
                      fielddata={BUSINESS_APP_FRM.fields.businessStreet}
                      changed={businessAppEleChange}
                    />
                    <Form.Group widths="equal">
                      {
                        ['city', 'state', 'zipCode'].map(field => (
                          <FormInput
                            key={field}
                            type="text"
                            name={field}
                            fielddata={BUSINESS_APP_FRM.fields[field]}
                            changed={businessAppEleChange}
                          />
                        ))
                      }
                    </Form.Group>
                  </div>
                </Grid.Column>
              </Grid>
              <Divider section className="doubled" />
              <Header as="h2">
                What industry are you in?
                <Header.Subheader>Please select all that apply.</Header.Subheader>
              </Header>
              <div className="iconic-checkbox">
                <Checkbox icon="ns-store" label="Fashion & Merchandising" />
                <Checkbox icon="ns-beauty-spa" label="Beauty & Spa" />
                <Checkbox icon="ns-food-light" label="Food & Beverage" />
                <Checkbox icon="ns-real-estate" label="Real Estate" />
                <Checkbox icon="ns-fitness" label="Fitness & Wellness" />
                <Checkbox icon="ns-first-aid" label="Hospitality" />
                <Checkbox icon="ns-technology" label="Technology" />
                <Checkbox label="Other Industry Type" />
              </div>
              <Divider section className="doubled" />
              <Header as="h2">
                What can NextSeed help you with?
                <Header.Subheader>
                  Select in which area NextSeed can help your business.
                </Header.Subheader>
              </Header>
              <div className="iconic-checkbox">
                <Checkbox icon="ns-new-business" label="Launch New Business" />
                <Checkbox icon="ns-franchise" label="Open Franchise" />
                <Checkbox icon="ns-expand-business" label="Expand/Upgrade Existing Business" />
                <Checkbox icon="ns-off-shoot-business" label="Create Off-shoot of Existing Business" />
              </div>
              <Divider section className="doubled" />
              <Header as="h2">Experience</Header>
              <Grid>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['relatedExperience', 'estCreditScore'].map(field => (
                        <FormInput
                          key={field}
                          name={field}
                          value={BUSINESS_APP_FRM.fields[field].value}
                          fielddata={BUSINESS_APP_FRM.fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                    {
                      ['projectCost', 'raiseRequired'].map(field => (
                        <FormInput
                          key={field}
                          name={field}
                          prefix="$"
                          value={BUSINESS_APP_FRM.fields[field].value}
                          fielddata={BUSINESS_APP_FRM.fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
              <Divider section className="doubled" />
              <Header as="h2">
                What will the funds be used for?
                <Header.Subheader>Please select all that apply.</Header.Subheader>
              </Header>
              <div className="iconic-checkbox">
                <Checkbox icon="ns-renovations" label="Renovations" />
                <Checkbox icon="ns-equipment-purchase" label="Equipment Purchase" />
                <Checkbox icon="ns-working-capital" label="Working Capital" />
                <Checkbox icon="ns-inventory" label="Inventory" />
                <Checkbox icon="ns-new-product" label="New product line" />
                <Checkbox icon="ns-new-location" label="New location" />
                <Checkbox icon="ns-restructure-debt" label="Restructure debt" />
                <Checkbox label="Other" />
              </div>
              <Divider section className="doubled" />
              <Header as="h2">
                Next year projections
                <Header.Subheader>
                  For your business, give us a quick snapshot of what the next year will look like.
                </Header.Subheader>
              </Header>
              <Grid>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['grossSales', 'goodsSold', 'operatingExpenses', 'netIncome'].map(field => (
                        <FormInput
                          key={field}
                          name={field}
                          prefix="$"
                          value={BUSINESS_APP_FRM.fields[field].value}
                          fielddata={BUSINESS_APP_FRM.fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
              <Divider section className="doubled" />
              <Header as="h2">What is your company’s entity structure?</Header>
              <div className="iconic-checkbox">
                <Checkbox icon="ns-corporation" label="Corporation" />
                <Checkbox icon="ns-business" label="LLC" />
                <Checkbox icon="ns-partnership" label="Limited Partnership" />
                <Checkbox icon="ns-proprietor" label="Sole Proprietor" />
                <Checkbox label="Other" />
              </div>
              <Divider section className="doubled" />
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default Signup;
