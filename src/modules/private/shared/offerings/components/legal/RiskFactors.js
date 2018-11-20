/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Checkbox, Form, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../theme/form';
import ButtonGroup from '../ButtonGroup';

const FormData = observer(({
  form,
  formName,
  formChange,
  checkboxField,
  descriptionField,
  isReadonly,
}) => (
  <div className="featured-section collapsed-checkbox">
    <Checkbox
      readOnly={isReadonly}
      name={checkboxField}
      label={
        <label>
          <Header as="h4">{form.fields[checkboxField].label}</Header>
        </label>
      }
      checked={form.fields[checkboxField].value}
      onChange={(e, result) => formChange(e, result, formName, false)}
    />
    <div className="checkbox-description">
      <p>{form.fields[descriptionField].label}</p>
      <FormTextarea
        readOnly={isReadonly}
        fielddata={form.fields[descriptionField]}
        name={descriptionField}
        containerclassname="secondary"
        changed={(e, result) => formChange(e, result, formName)}
        hidelabel
      />
    </div>
  </div>
));

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class RiskFactors extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('GENERAL_FRM', 'legal.general');
    this.props.offeringCreationStore.setFormData('RISK_FACTORS_FRM', 'legal.riskFactors');
    if (!this.props.offeringCreationStore.initLoad.includes('DOCUMENTATION_FRM')) {
      this.props.offeringCreationStore.setFormData('DOCUMENTATION_FRM', 'legal.documentation.issuer');
    }
  }
  handleFormSubmit = (isApproved = null) => {
    const {
      RISK_FACTORS_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, RISK_FACTORS_FRM.fields, 'legal', 'riskFactors', true, undefined, isApproved);
  }
  render() {
    const { RISK_FACTORS_FRM, formChange } = this.props.offeringCreationStore;
    const formName = 'RISK_FACTORS_FRM';
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.legal && offer.legal.riskFactors &&
      offer.legal.riskFactors.submitted) ? offer.legal.riskFactors.submitted : null;
    const approved = (offer && offer.legal && offer.legal.riskFactors &&
      offer.legal.riskFactors.approved) ? offer.legal.riskFactors.approved : null;
    const issuerSubmitted = (offer && offer.legal && offer.legal.riskFactors &&
      offer.legal.riskFactors.issuerSubmitted) ? offer.legal.riskFactors.issuerSubmitted : null;
    const isReadonly = ((isIssuer && issuerSubmitted) || (submitted && !isManager && !isIssuer) ||
      (isManager && approved && approved.status));
    return (
      <div className={isIssuer || (isIssuer && !match.url.includes('offering-creation')) ? 'ui card fluid form-card' : ''}>
        <Form>
          {
            Object.keys(RISK_FACTORS_FRM.fields).filter(f => RISK_FACTORS_FRM.fields[f].refSelector)
            .map(field => (
              <FormData
                isReadonly={isReadonly}
                formName={formName}
                form={RISK_FACTORS_FRM}
                formChange={formChange}
                checkboxField={RISK_FACTORS_FRM.fields[field].refSelector}
                descriptionField={field}
              />
            ))
          }
          <Divider hidden />
          <ButtonGroup
            isIssuer={isIssuer}
            submitted={submitted}
            isManager={isManager}
            formValid={RISK_FACTORS_FRM.meta.isValid}
            approved={approved}
            updateOffer={this.handleFormSubmit}
            issuerSubmitted={issuerSubmitted}
          />
        </Form>
      </div>
    );
  }
}
