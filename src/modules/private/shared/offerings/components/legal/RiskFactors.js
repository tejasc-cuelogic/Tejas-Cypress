/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Checkbox, Form, Divider, Button, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../theme/form';

const FormData = observer(({
  form,
  formName,
  formChange,
  checkboxField,
  descriptionField,
}) => (
  <div className="featured-section collapsed-checkbox">
    <Checkbox
      name={checkboxField}
      label={
        <label>
          <Header as="h4">{form.fields[checkboxField].label}</Header>
        </label>
      }
      checked={form.fields[checkboxField].value}
      onChange={(e, result) => formChange(e, result, formName)}
    />
    <div className="checkbox-description">
      <p>{form.fields[descriptionField].label}</p>
      <FormTextarea
        fielddata={form.fields[descriptionField]}
        name={descriptionField}
        containerclassname="secondary"
        changed={(e, result) => formChange(e, result, formName)}
        hidelabel
      />
    </div>
  </div>
));

@inject('offeringCreationStore', 'offeringsStore')
@observer
export default class RiskFactors extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('RISK_FACTORS_FRM', 'legal.riskFactors');
  }
  handleFormSubmit = () => {
    const {
      RISK_FACTORS_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, RISK_FACTORS_FRM.fields, 'legal', 'riskFactors');
  }
  render() {
    const { RISK_FACTORS_FRM, formChange } = this.props.offeringCreationStore;
    const formName = 'RISK_FACTORS_FRM';
    const { offer } = this.props.offeringsStore;
    return (
      <div className={offer.stage === 'CREATION' ? 'ui card fluid form-card' : ''}>
        <Form onSubmit={this.handleFormSubmit}>
          {
            Object.keys(RISK_FACTORS_FRM.fields).filter(f => RISK_FACTORS_FRM.fields[f].refSelector)
            .map(field => (
              <FormData
                formName={formName}
                form={RISK_FACTORS_FRM}
                formChange={formChange}
                checkboxField={RISK_FACTORS_FRM.fields[field].refSelector}
                descriptionField={field}
              />
            ))
          }
          <Divider hidden />
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
              <Button primary className="relaxed pull-right" >Save</Button>
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}
