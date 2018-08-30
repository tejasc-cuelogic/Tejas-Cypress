import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Grid, Form, Popup, Icon } from 'semantic-ui-react';
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
      BUSINESS_APP_REAL_ESTATE_FRM, businessAppEleChange, setAddressFields,
      businessAppEleMaskChange, preQualFormDisabled,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_APP_REAL_ESTATE_FRM;
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
                      changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_REAL_ESTATE_FRM')}
                    />
                  ))
                }
                <MaskedInput
                  disabled={preQualFormDisabled}
                  name="phoneNumber"
                  fielddata={fields.phoneNumber}
                  changed={(values, field) => businessAppEleMaskChange(values, field, 'BUSINESS_APP_REAL_ESTATE_FRM')}
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
                  changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_REAL_ESTATE_FRM')}
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
                        changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_REAL_ESTATE_FRM')}
                      />
                    ))
                  }
                </Form.Group>
              </div>
            </Grid.Column>
          </Grid>
        </FormElementWrap>
        <FormElementWrap header="Select Investment Type" subHeader="Select your Investment Type.">
          <FormRadioGroup
            vertical
            disabled={preQualFormDisabled}
            fielddata={fields.investmentType}
            name="investmentType"
            changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_REAL_ESTATE_FRM')}
          />
        </FormElementWrap>
        <FormElementWrap header="Select Real Estate Type" subHeader="Please select all that apply.">
          <FormCheckbox
            disabled={preQualFormDisabled}
            fielddata={fields.realEstateType}
            name="realEstateType"
            changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_REAL_ESTATE_FRM')}
            containerclassname="iconic-checkbox"
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
                      changed={(values, field1) => businessAppEleMaskChange(values, field1, 'BUSINESS_APP_REAL_ESTATE_FRM')}
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
                      changed={(values, field1) => businessAppEleMaskChange(values, field1, 'BUSINESS_APP_REAL_ESTATE_FRM')}
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
            changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_REAL_ESTATE_FRM')}
            defaults
            containerclassname="ui relaxed list"
          />
        </FormElementWrap>
        <FormElementWrap
          header="Do you currently own or operate this property?"
        >
          <FormRadioGroup
            disabled={preQualFormDisabled}
            fielddata={fields.ownProperty}
            name="ownProperty"
            changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_REAL_ESTATE_FRM')}
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
                      changed={(values, field1) => businessAppEleMaskChange(values, field1, 'BUSINESS_APP_REAL_ESTATE_FRM')}
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
                  changed={(values, field) => businessAppEleMaskChange(values, field, 'BUSINESS_APP_REAL_ESTATE_FRM')}
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
            changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_REAL_ESTATE_FRM')}
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
            changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_REAL_ESTATE_FRM')}
            defaults
            containerclassname="ui relaxed list"
          />
        </FormElementWrap>
      </Aux>
    );
  }
}
