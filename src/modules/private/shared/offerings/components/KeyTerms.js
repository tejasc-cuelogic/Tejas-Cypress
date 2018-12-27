import React, { Component } from 'react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { BUSINESS_INDUSTRIES, SECURITIES_VALUES, BUSINESS_TYPE_VALUES, REGULATION_VALUES } from '../../../../../services/constants/admin/offerings';
import { FormInput, MaskedInput, FormDropDown, FormTextarea, FormRadioGroup, DropZoneConfirm as DropZone } from '../../../../../theme/form';
import ButtonGroupType2 from './ButtonGroupType2';

@inject('offeringCreationStore', 'uiStore', 'offeringsStore', 'userStore')
@observer
export default class KeyTerms extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('KEY_TERMS_FRM', 'keyTerms');
  }
  onProFormasDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadData('KEY_TERMS_FRM', 'uploadProformas', files, '', null, 'KEY_TERMS_PROFORMAS');
  }
  handleDelDoc = (field) => {
    this.props.offeringCreationStore.removeUploadedDataMultiple('KEY_TERMS_FRM', field, null, '');
  }
  handleFormSubmit = (isApproved = null) => {
    const { KEY_TERMS_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, KEY_TERMS_FRM.fields, 'keyTerms', null, true, undefined, isApproved);
  }
  render() {
    const { KEY_TERMS_FRM, formChange, maskChange } = this.props.offeringCreationStore;
    const formName = 'KEY_TERMS_FRM';
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.keyTerms && offer.keyTerms.submitted) ?
      offer.keyTerms.submitted : null;
    const approved = (offer && offer.keyTerms && offer.keyTerms.approved) ?
      offer.keyTerms.approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    return (
      <div className="inner-content-spacer">
        <Form>
          <Header as="h4">General</Header>
          <Form.Group widths={3}>
            {['legalBusinessName', 'shorthandBusinessName'].map(field => (
              <FormInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
              />
            ))}
            <FormDropDown
              disabled={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.industry}
              selection
              value={KEY_TERMS_FRM.fields.industry.value}
              name="industry"
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              options={BUSINESS_INDUSTRIES}
              onChange={(e, result) => formChange(e, result, formName)}
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
            />
            {['city', 'state'].map(field => (
              <FormInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
              />
            ))}
            <FormDropDown
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
              disabled={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.securities}
              selection
              value={KEY_TERMS_FRM.fields.securities.value}
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              name="securities"
              options={SECURITIES_VALUES}
              onChange={(e, result) => formChange(e, result, formName)}
            />
            {['minOfferingAmount', 'maxOfferingAmount'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, formName, name)}
                currency
                prefix="$"
              />
            ))}
            <FormDropDown
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
              disabled={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.legalBusinessType}
              selection
              value={KEY_TERMS_FRM.fields.legalBusinessType.value}
              name="legalBusinessType"
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              options={BUSINESS_TYPE_VALUES}
              onChange={(e, result) => formChange(e, result, formName)}
            />
          </Form.Group>
          <Header as="h4">Key Terms</Header>
          <Form.Group widths={3}>
            <FormInput
              displayMode={isReadonly}
              name="maturity"
              fielddata={KEY_TERMS_FRM.fields.maturity}
              changed={(e, result) => formChange(e, result, formName)}
            />
            <MaskedInput
              displayMode={isReadonly}
              name="startupPeriod"
              fielddata={KEY_TERMS_FRM.fields.startupPeriod}
              changed={(values, name) => maskChange(values, formName, name)}
              number
            />
            <FormDropDown
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
              disabled={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.regulation}
              selection
              value={KEY_TERMS_FRM.fields.regulation.value}
              name="regulation"
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              options={REGULATION_VALUES}
              onChange={(e, result) => formChange(e, result, formName)}
            />
            {['investmentMultiple', 'securityInterest', 'interestRate'].map(field => (
              <FormInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
              />
            ))}
            <MaskedInput
              displayMode={isReadonly}
              name="minInvestAmt"
              fielddata={KEY_TERMS_FRM.fields.minInvestAmt}
              changed={(values, name) => maskChange(values, formName, name)}
              currency
              prefix="$"
            />
            <FormInput
              displayMode={isReadonly}
              name="revSharePercentage"
              fielddata={KEY_TERMS_FRM.fields.revSharePercentage}
              changed={(e, result) => formChange(e, result, formName)}
            />
            <MaskedInput
              displayMode={isReadonly}
              name="securitiesOwnershipPercentage"
              fielddata={KEY_TERMS_FRM.fields.securitiesOwnershipPercentage}
              changed={(values, name) => maskChange(values, formName, name)}
              percentage
            />
            <FormInput
              displayMode={isReadonly}
              name="frequencyOfPayments"
              fielddata={KEY_TERMS_FRM.fields.frequencyOfPayments}
              changed={(e, result) => formChange(e, result, formName)}
            />
          </Form.Group>
          <Form.Group widths={2}>
            {['investmentMultipleSummary', 'offeringDisclaimer', 'revShareSummary', 'revSharePercentageDescription'].map(field => (
              <FormTextarea
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
                containerclassname="secondary"
              />
            ))}
          </Form.Group>
          <Header as="h4">Legal</Header>
          <Form.Group widths={3}>
            {['locationRiskFactors', 'stateOfFormation', 'appendixATitle'].map(field => (
              <FormInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
              />
            ))}
            {['maxInvestAmt', 'nsMinFees', 'nsMaxFees'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, formName, name)}
                currency
                prefix="$"
              />
            ))}
            {['offeringExpTarget', 'offeringExpMax', 'stockType'].map(field => (
              field === 'stockType' ? (
                <FormInput
                  displayMode={isReadonly}
                  name="stockType"
                  fielddata={KEY_TERMS_FRM.fields.stockType}
                  changed={(e, result) => formChange(e, result, formName)}
                />
              ) : (
                <MaskedInput
                  displayMode={isReadonly}
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  currency
                  prefix="$"
                />
              )
            ))}
          </Form.Group>
          <Form.Group widths={2}>
            {['useOfProceedFootnote', 'currentFinancialStatements'].map(field => (
              <FormTextarea
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
                containerclassname="secondary"
              />
            ))}
          </Form.Group>
          <Form.Group widths={3}>
            {['isNewBusiness', 'isHealthcare'].map(field => (
              <div className="field">
                <Header as="label">{KEY_TERMS_FRM.fields[field].label}</Header>
                <Form.Group inline>
                  <FormRadioGroup
                    readOnly={isReadonly}
                    containerclassname={isReadonly ? 'display-only' : ''}
                    fielddata={KEY_TERMS_FRM.fields[field]}
                    name={field}
                    changed={(e, result) => formChange(e, result, formName)}
                  />
                </Form.Group>
              </div>
            ))}
            <DropZone
              disabled={isReadonly}
              name="uploadProformas"
              fielddata={KEY_TERMS_FRM.fields.uploadProformas}
              ondrop={(files, name) => this.onProFormasDrop(files, name)}
              onremove={fieldName => this.handleDelDoc(fieldName)}
              uploadtitle="Upload a file"
              containerclassname="field"
            />
            {['isAlcohol', 'isFood'].map(field => (
              <div className="field">
                <Header as="label">{KEY_TERMS_FRM.fields[field].label}</Header>
                <Form.Group inline>
                  <FormRadioGroup
                    containerclassname={isReadonly ? 'display-only' : ''}
                    readOnly={isReadonly}
                    fielddata={KEY_TERMS_FRM.fields[field]}
                    name={field}
                    changed={(e, result) => formChange(e, result, formName)}
                  />
                </Form.Group>
              </div>
            ))}
          </Form.Group>
          <Divider hidden />
          <ButtonGroupType2
            submitted={submitted}
            isManager={isManager}
            approved={approved}
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}
