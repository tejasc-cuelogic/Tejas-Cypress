import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, FormCheckbox } from '../../../../../../theme/form';

@inject('businessAppStore', 'uiStore')
@observer
export default class PreQualification extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange, preQualFormDisabled,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_APP_FRM;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">What is your Business Model?</Header>
          <p>{fields.businessModel.value === 'B2C' ? 'Business to Consumer' : 'Business to Business'}</p>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">General Information</Header>
          <Form.Group widths={4}>
            {
              ['street', 'city', 'state', 'zipCode'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={fields[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
            }
          </Form.Group>
          <Form.Group widths={4}>
            {
              ['website', 'phoneNumber'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={fields[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">What industry are you in?</Header>
          <p>
            {fields.industryTypes.values.find(e => e.value === fields.industryTypes.value).label}
          </p>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">What can NextSeed help you with?</Header>
          <p>{fields.businessGoal.values.find(e => e.value === fields.businessGoal.value).label}</p>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Experience</Header>
          <Form.Group widths={4}>
            {
              ['industryExperience', 'estimatedCreditScore', 'totalProjectCost', 'amountNeeded'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={fields[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">What will the funds be used for?</Header>
          <p>{fields.fundUsage.values.find(e => e.value === fields.fundUsage.value).label}</p>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Next year projections</Header>
          <Form.Group widths={4}>
            {
              ['nextYearGrossSales', 'nextYearCogSold', 'nextYearOperatingExpenses', 'nextYearNetIncome'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={fields[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">What is your company’s entity structure?</Header>
          <p>
            {fields.businessEntityStructure.values.find(e =>
              e.value === fields.businessEntityStructure.value).label}
          </p>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Legal Confirmation</Header>
          <FormCheckbox
            disabled={preQualFormDisabled}
            fielddata={fields.legalConfirmation}
            name="legalConfirmation"
            changed={businessAppEleChange}
            defaults
            readOnly
            containerclassname="ui relaxed list"
          />
        </div>
      </Form>
    );
  }
}
