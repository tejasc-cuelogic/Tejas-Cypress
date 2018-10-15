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
      disabled={isReadonly}
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

@inject('offeringCreationStore', 'userStore')
@observer
export default class RiskFactors extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('GENERAL_FRM', 'legal.general');
    this.props.offeringCreationStore.setFormData('RISK_FACTORS_FRM', 'legal.riskFactors');
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
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isApproved = false;
    const isReadonly = isApproved;
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
            isManager={access.asManager}
            formValid={RISK_FACTORS_FRM.meta.isValid}
            isApproved={isApproved}
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}
