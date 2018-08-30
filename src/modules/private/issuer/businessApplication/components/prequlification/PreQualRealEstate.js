import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Grid, Form, Popup, Icon, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import {
  FormRadioGroup, FormCheckbox, FormInput, MaskedInput, AutoComplete,
} from '../../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

@inject('businessAppStore')
@observer
export default class PreQualRealEstate extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange, setAddressFields,
      businessAppEleMaskChange, preQualFormDisabled, getInvestmentTypeTooltip,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_APP_FRM;
    return (
      <Aux>
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
                      label={field === 'businessName' ? 'Entity Name' : ''}
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
                <Header as="h6">
                  {'Entity Address '}
                  <Popup
                    trigger={<Icon className="ns-help-circle" />}
                    content="Enter address of investment location,
                    not of owner or entity."
                    position="top center"
                    className="center-align"
                    wide
                  />
                </Header>
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
        <FormElementWrap header="Industries">
          <FormCheckbox
            disabled={preQualFormDisabled}
            fielddata={fields.industryTypes}
            name="industryTypes"
            changed={businessAppEleChange}
            containerclassname="iconic-checkbox"
          />
        </FormElementWrap>
        <FormElementWrap header="Select Investment Type" subHeader="Select your Investment Type.">
          <FormRadioGroup
            containerclassname="button-radio"
            disabled={preQualFormDisabled}
            fielddata={fields.investmentType}
            name="investmentType"
            changed={businessAppEleChange}
          />
          <Divider hidden />
          {getInvestmentTypeTooltip &&
          <p>
            {getInvestmentTypeTooltip}
          </p>}
        </FormElementWrap>
        <FormElementWrap header="Select Real Estate Type" subHeader="Please select all that apply.">
          <FormRadioGroup
            containerclassname="button-radio"
            disabled={preQualFormDisabled}
            fielddata={fields.realEstateType}
            name="realEstateType"
            changed={businessAppEleChange}
          />
        </FormElementWrap>
        <FormElementWrap header="Experience">
          <Grid>
            <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
              <div className="field-wrap">
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
            containerclassname="iconic-checkbox"
            disabled={preQualFormDisabled}
            fielddata={fields.fundUsage}
            name="fundUsage"
            changed={businessAppEleChange}
          />
        </FormElementWrap>
        <FormElementWrap
          header="Do you currently own or operate this property?"
        >
          <FormRadioGroup
            disabled={preQualFormDisabled}
            fielddata={fields.ownProperty}
            name="ownProperty"
            changed={businessAppEleChange}
            containerclassname="button-radio"
          />
        </FormElementWrap>
        <FormElementWrap header="Target">
          <Grid>
            <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
              <div className="field-wrap">
                {
                  ['targetedInvestorIrr', 'targetedAnnualInvestor'].map(field => (
                    <MaskedInput
                      disabled={preQualFormDisabled}
                      key={field}
                      name={field}
                      percentage
                      tooltip={fields[field].tooltip}
                      value={fields[field].value}
                      fielddata={fields[field]}
                      changed={businessAppEleMaskChange}
                    />
                  ))
                }
                <MaskedInput
                  hoverable
                  disabled={preQualFormDisabled}
                  name="targetedHoldTime"
                  number
                  value={fields.targetedHoldTime.value}
                  fielddata={fields.targetedHoldTime}
                  changed={businessAppEleMaskChange}
                />
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
      </Aux>
    );
  }
}
