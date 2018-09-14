/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Checkbox, Form, Button, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../theme/form';

const FormData = ({
  form,
  formName,
  formChange,
  checkboxField,
  descriptionField,
}) => (
  <div className="featured-section collapsed-checkbox">
    <Checkbox
      label={
        <label>
          <Header as="h4">
            {form.fields[checkboxField].label}
          </Header>
        </label>
      }
      onChange={(e, result) => formChange(e, result, formName)}
    />
    <div className="checkbox-description">
      {form.fields[descriptionField].label}
      <FormTextarea
        fielddata={form.fields[descriptionField]}
        name={descriptionField}
        containerclassname="secondary"
        changed={(e, result) => formChange(e, result, formName)}
        hidelabel
      />
    </div>
  </div>
);

@inject('offeringCreationStore')
@observer
export default class RiskFactors extends Component {
  render() {
    const { RISK_FACTORS_FRM, formChange } = this.props.offeringCreationStore;
    const formName = 'RISK_FACTORS_FRM';
    return (
      <Form>
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isBusinessRisk" descriptionField="businessRiskDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isFinancingRisks" descriptionField="financingRisksDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isDevelopmentRisks" descriptionField="developmentRisksDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isReputationalRisk" descriptionField="reputationalRiskDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isCompetitionRisks" descriptionField="competitionRisksDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isMarketRisks" descriptionField="marketRisksDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isNaturalRisks" descriptionField="naturalRisksDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isManagementRisks" descriptionField="managementRisksDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isPersonnelRisks" descriptionField="personnelRisksDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isLaborSupplyRisks" descriptionField="laborSupplyRisksDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isPrivacyRisks" descriptionField="privacyRisksDesc" />
        <FormData formName={formName} form={RISK_FACTORS_FRM} formChange={formChange} checkboxField="isOtherRisks" descriptionField="otherRisksDesc" />
        <div className="clearfix mb-20">
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Submitted by ISSUER_NAME on 2/3/2018
          </Button>
          <Button.Group floated="right">
            <Button inverted color="red" content="Decline" disabled={!RISK_FACTORS_FRM.meta.isValid} />
            <Button color="green" className="relaxed" disabled={!RISK_FACTORS_FRM.meta.isValid} >Approve</Button>
          </Button.Group>
        </div>
        <div className="clearfix">
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Approved by MANAGER_NAME on 2/3/2018
          </Button>
          <Button.Group floated="right">
            <Button primary type="button" className="relaxed pull-right" disabled={!RISK_FACTORS_FRM.meta.isValid} >Save</Button>
          </Button.Group>
        </div>
      </Form>
    );
  }
}
