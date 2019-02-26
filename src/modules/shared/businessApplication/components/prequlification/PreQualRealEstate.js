import React, { Component } from 'react';
import Aux from 'react-aux';
import { Grid, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import {
  FormRadioGroup, FormCheckbox, MaskedInput,
} from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';
import GeneralInformation from './GeneralInformation';
import Experience from './Experience';
import EntityAndLegal from './EntityAndLegal';

// const isMobile = document.documentElement.clientWidth < 768;
@inject('businessAppStore')
@observer
export default class PreQualRealEstate extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange, setAddressFields, currentApplicationType,
      businessAppEleMaskChange, preQualFormDisabled, getInvestmentTypeTooltip,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_APP_FRM;
    const { hideFields } = this.props;
    return (
      <Aux>
        <GeneralInformation
          hideFields={hideFields}
          fields={fields}
          preQualFormDisabled={preQualFormDisabled}
          businessAppEleChange={businessAppEleChange}
          businessAppEleMaskChange={businessAppEleMaskChange}
          currentApplicationType={this.props.applicationType || currentApplicationType}
          setAddressFields={setAddressFields}
        />
        <FormElementWrap hideFields={hideFields} header="Industries *" subHeader="Please select all that apply.">
          <FormCheckbox
            disabled={preQualFormDisabled}
            fielddata={fields.industryTypes}
            name="industryTypes"
            changed={businessAppEleChange}
            containerclassname="iconic-checkbox"
          />
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="Investment Type *" subHeader="Select your Investment Type.">
          <FormRadioGroup
            containerclassname="button-radio"
            disabled={preQualFormDisabled}
            fielddata={fields.investmentType}
            name="investmentType"
            changed={businessAppEleChange}
          />
          <Divider hidden />
          {!hideFields && getInvestmentTypeTooltip &&
          <p>
            {getInvestmentTypeTooltip}
          </p>}
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="Real Estate Type *" subHeader="Select all the Real Estate types that apply.">
          <FormCheckbox
            containerclassname="button-checkbox"
            disabled={preQualFormDisabled}
            fielddata={fields.realEstateType}
            name="realEstateType"
            changed={businessAppEleChange}
          />
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="Experience">
          <Grid>
            <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
              <div className="field-wrap">
                <Experience
                  fields={fields}
                  preQualFormDisabled={preQualFormDisabled}
                  businessAppEleMaskChange={businessAppEleMaskChange}
                />
              </div>
            </Grid.Column>
          </Grid>
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="What will the funds be used for? *" subHeader="Please select all that apply.">
          <FormCheckbox
            containerclassname="button-checkbox"
            disabled={preQualFormDisabled}
            fielddata={fields.fundUsage}
            name="fundUsage"
            changed={businessAppEleChange}
          />
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="Do you currently own or operate this property? *">
          <FormRadioGroup
            disabled={preQualFormDisabled}
            fielddata={fields.ownOrOperateProperty}
            name="ownOrOperateProperty"
            changed={businessAppEleChange}
            containerclassname="button-radio mobile-radio-button"
          />
        </FormElementWrap>
        <FormElementWrap hideFields={hideFields} header="Target">
          <Grid>
            <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
              <div className="field-wrap">
                {
                  ['investorIRR', 'annualInvestorRoi'].map(field => (
                    <MaskedInput
                      containerclassname={preQualFormDisabled ? 'display-only' : ''}
                      readOnly={preQualFormDisabled}
                      key={field}
                      name={field}
                      percentage
                      asterisk="true"
                      tooltip={fields[field].tooltip}
                      value={fields[field].value}
                      fielddata={fields[field]}
                      changed={businessAppEleMaskChange}
                    />
                  ))
                }
                <MaskedInput
                  hoverable
                  containerclassname={preQualFormDisabled ? 'display-only' : ''}
                  readOnly={preQualFormDisabled}
                  name="holdTimeInYears"
                  number
                  asterisk="true"
                  value={fields.holdTimeInYears.value}
                  fielddata={fields.holdTimeInYears}
                  changed={businessAppEleMaskChange}
                />
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
