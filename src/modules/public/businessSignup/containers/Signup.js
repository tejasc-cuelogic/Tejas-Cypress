import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Grid, Icon, Header, Divider, Form, Checkbox, Popup, List, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup, FormCheckbox, FormInput, MaskedInput2, AutoComplete } from '../../../../theme/form/FormElements';

@inject('newBusinessStore')
@observer
class Signup extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange, setAddressFields,
    } = this.props.newBusinessStore;
    const { fields } = BUSINESS_APP_FRM;
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
                fielddata={fields.businessType}
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
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                    <MaskedInput2
                      name="phoneNumber"
                      fielddata={fields.phoneNumber}
                      changed={businessAppEleChange}
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
              </Grid>
              <Divider section className="doubled" />
              <Header as="h2">
                What industry are you in?
                <Header.Subheader>Please select all that apply.</Header.Subheader>
              </Header>
              <div className="iconic-checkbox">
                <FormCheckbox
                  fielddata={BUSINESS_APP_FRM.fields.industryType}
                  name="industryType"
                  changed={businessAppEleChange}
                  containerclassname="iconic-checkbox"
                />
              </div>
              <Divider section className="doubled" />
              <Header as="h2">
                What can NextSeed help you with?
                <Header.Subheader>
                  Select in which area NextSeed can help your business.
                </Header.Subheader>
              </Header>
              <FormRadioGroup
                fielddata={BUSINESS_APP_FRM.fields.businessHelp}
                name="businessHelp"
                changed={businessAppEleChange}
                containerclassname="iconic-radio"
              />
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
                        <MaskedInput2
                          key={field}
                          name={field}
                          isCurrency
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
              <FormCheckbox
                fielddata={BUSINESS_APP_FRM.fields.fundUsage}
                name="fundUsage"
                changed={businessAppEleChange}
                containerclassname="iconic-checkbox"
              />
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
                        <MaskedInput2
                          key={field}
                          name={field}
                          isCurrency
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
              <FormRadioGroup
                fielddata={BUSINESS_APP_FRM.fields.entityStructure}
                name="entityStructure"
                changed={businessAppEleChange}
                containerclassname="iconic-radio"
              />
              <Divider section className="doubled" />
              <Header as="h2">
                Legal Confirmation
                <Header.Subheader>
                  Please check all that apply.
                  Note some of these items are not disqualifying conditions, but a NextSeed
                  representative may follow up to verify any applicable details
                </Header.Subheader>
              </Header>
              <List relaxed>
                {/* <FormCheckbox
                  fielddata={BUSINESS_APP_FRM.fields.legalConfirmation}
                  name="legalConfirmation"
                  changed={businessAppEleChange}
                /> */}
                <List.Item>
                  <Checkbox label="The company has not raised securities under Regulation Crowdfunding in the last 12 months." />
                </List.Item>
                <List.Item>
                  <Checkbox label="The company is not concurrently conducting an offering on another platform." />
                </List.Item>
                <List.Item>
                  <Checkbox label="The company is not a broker-dealer." />
                </List.Item>
                <List.Item>
                  <Checkbox label="The company is organized in the United States" />
                </List.Item>
                <List.Item>
                  <Checkbox label="The company is not an investment company." />
                </List.Item>
                <List.Item>
                  <Checkbox label="The company has not sold securities registered under the Securities Exchange Act of 1934." />
                </List.Item>
                <List.Item>
                  <Checkbox label={
                    /*  eslint-disable jsx-a11y/label-has-for */
                    <label>I have never filed for bankruptcy.
                      <Popup
                        trigger={<Icon name="help circle outline" />}
                        content="If you have filed for bankruptcy, a NextSeed representative may follow up to verity the details of the bankruptcy"
                        position="top center"
                      />
                    </label>}
                  />
                </List.Item>
                <List.Item>
                  <Checkbox label="I am not currently charged with or have ever been convicted of fraud." />
                </List.Item>
                <List.Item>
                  <Checkbox label="I am not currently charged with or have ever been convicted of a serious criminal offense." />
                </List.Item>
                <Divider section />
                <List.Item>
                  <Checkbox defaultChecked label="Please check here if you wish to subscribe to the latest news and offers from NextSeed.  You may unsubscribe at any time" />
                </List.Item>
              </List>
              <Divider section hidden />
              <Button size="large" color="green" className="very relaxed" disabled>Submit</Button>
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default Signup;
