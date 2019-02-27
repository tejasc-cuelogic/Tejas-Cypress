import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Grid, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup, FormCheckbox, MaskedInput } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';
import GeneralInformation from './GeneralInformation';
import Experience from './Experience';
import EntityAndLegal from './EntityAndLegal';

@inject('businessAppStore')
@observer
export default class PreQualBusiness extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange, setAddressFields,
      businessAppEleMaskChange, getFranchiseCondition,
      getBusinessTypeCondtion, currentApplicationType,
      preQualFormDisabled,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_APP_FRM;
    const { hideFields } = this.props;
    return (
      <Aux>
        <FormElementWrap
          hideFields={hideFields}
          header="What is your Business Model?*"
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
        <GeneralInformation
          hideFields={hideFields}
          fields={fields}
          preQualFormDisabled={preQualFormDisabled}
          businessAppEleChange={businessAppEleChange}
          businessAppEleMaskChange={businessAppEleMaskChange}
          currentApplicationType={this.props.applicationType || currentApplicationType}
          setAddressFields={setAddressFields}
        />
        <FormElementWrap hideFields={hideFields} header="What industry are you in?*" subHeader="Please select all that apply.">
          <FormCheckbox
            disabled={preQualFormDisabled}
            fielddata={fields.industryTypes}
            name="industryTypes"
            changed={businessAppEleChange}
            containerclassname="iconic-checkbox"
          />
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="What can NextSeed help you with?*" subHeader="Select in which area NextSeed can help your business.">
          <FormRadioGroup
            disabled={preQualFormDisabled}
            fielddata={fields.businessGoal}
            name="businessGoal"
            changed={businessAppEleChange}
            iconic
            containerclassname="iconic-radio"
          />
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="Experience">
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
                            maxLength="2"
                            containerclassname={preQualFormDisabled ? 'display-only' : ''}
                            readOnly={preQualFormDisabled}
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
                <Experience
                  fields={fields}
                  preQualFormDisabled={preQualFormDisabled}
                  businessAppEleMaskChange={businessAppEleMaskChange}
                />
              </div>
            </Grid.Column>
          </Grid>
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="What will the funds be used for?*" subHeader="Please select all that apply.">
          <FormCheckbox
            disabled={preQualFormDisabled}
            fielddata={fields.fundUsage}
            name="fundUsage"
            changed={businessAppEleChange}
            containerclassname="iconic-checkbox"
          />
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields}>
          <Grid>
            {getBusinessTypeCondtion &&
              <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
                <Header as={hideFields ? 'h4' : 'h3'}>
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
                        containerclassname={preQualFormDisabled ? 'display-only' : ''}
                        readOnly={preQualFormDisabled}
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
              <Header as={hideFields ? 'h4' : 'h3'}>
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
                      containerclassname={preQualFormDisabled ? 'display-only' : ''}
                      readOnly={preQualFormDisabled}
                      key={field}
                      name={field}
                      prefix="$ "
                      currency
                      asterisk="true"
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
        <EntityAndLegal
          hideFields={hideFields}
          fields={fields}
          preQualFormDisabled={preQualFormDisabled}
          businessAppEleChange={businessAppEleChange}
        />
      </Aux>
    );
  }
}
