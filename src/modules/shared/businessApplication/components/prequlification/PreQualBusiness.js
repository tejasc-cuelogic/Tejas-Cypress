import React, { Component } from 'react';
import { Header, Grid, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup, FormCheckbox, MaskedInput } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';
import { BUSINESS_GOAL } from '../../../../../services/constants/businessApplication';
import GeneralInformation from './GeneralInformation';
import Experience from './Experience';
import EntityAndLegal from './EntityAndLegal';

@inject('businessAppStore')
@observer
export default class PreQualBusiness extends Component {
  filterBusinessGoals = () => {
    const { BUSINESS_APP_FRM, getBusinessApplicationGoal } = this.props.businessAppStore;
    const { fields } = BUSINESS_APP_FRM;
    const buisnessArr = [BUSINESS_GOAL.BRAND_NEW, BUSINESS_GOAL.UPGRADE];
    return {
      ...fields.businessGoal,
      values: fields.businessGoal.values.filter(goal => (
        getBusinessApplicationGoal
          ? buisnessArr.includes(goal.value)
          : !buisnessArr.includes(goal.value)
      )),
    };
  }

  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange, setAddressFields,
      businessAppEleMaskChange,
      getBusinessTypeCondtion, currentApplicationType,
      preQualFormDisabled,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_APP_FRM;
    const { hideFields } = this.props;
    return (
      <>
        <span className="application-scroll" />
        {/* <FormElementWrap
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
        </FormElementWrap> */}
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
        <FormElementWrap hideFields={hideFields} header="Which of the following securities are you open to exploring with NextSeed?*" subHeader="Please select all that apply.">
          <FormCheckbox
            disabled={preQualFormDisabled}
            fielddata={fields.businessSecurities}
            name="businessSecurities"
            changed={businessAppEleChange}
            containerclassname="iconic-checkbox"
          />
          <div className="mt-10">
            {<span>{fields.businessSecurities.values[3].tooltip}</span>}
          </div>
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="What would best describe your company's phase of development?*">
          <FormRadioGroup
            disabled={preQualFormDisabled}
            fielddata={this.filterBusinessGoals()}
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
                {getBusinessTypeCondtion
                  && (
                    <>
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
                              asterisk="true"
                              number
                              value={fields[field].value}
                              fielddata={fields[field]}
                              changed={businessAppEleMaskChange}
                            />
                          ))
                        }
                      </Form.Group>
                    </>
                  )
                }
                <Experience
                  fields={fields}
                  preQualFormDisabled={preQualFormDisabled}
                  currentApplicationType={this.props.applicationType || currentApplicationType}
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
            {getBusinessTypeCondtion
              && (
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
                          asterisk="true"
                          prefix="$ "
                          allowNegative={field === 'previousYearNetIncome'}
                          currency
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleMaskChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              )
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
                      allowNegative={field === 'nextYearNetIncome'}
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
      </>
    );
  }
}
