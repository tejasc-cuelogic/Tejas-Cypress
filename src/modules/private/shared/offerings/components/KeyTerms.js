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
        <Header as="h4">Basic</Header>
        <Form>
          <Form.Group widths="3">
            {
            ['legalBusinessName', 'shorthandBusinessName'].map(field => (
              <FormInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
              />
            ))
            }
            <div className="field">
              <FormDropDown
                disabled={isReadonly}
                fielddata={KEY_TERMS_FRM.fields.industry}
                selection
                containerclassname="dropdown-field"
                value={KEY_TERMS_FRM.fields.industry.value}
                name="industry"
                options={BUSINESS_INDUSTRIES}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </div>
            <MaskedInput
              displayMode={isReadonly}
              name="maturity"
              fielddata={KEY_TERMS_FRM.fields.maturity}
              changed={(values, name) => maskChange(values, formName, name)}
              number
            />
            <div className="field">
              <FormDropDown
                disabled={isReadonly}
                fielddata={KEY_TERMS_FRM.fields.regulation}
                selection
                containerclassname="dropdown-field"
                value={KEY_TERMS_FRM.fields.regulation.value}
                name="regulation"
                options={REGULATION_VALUES}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </div>
            <FormInput
              displayMode={isReadonly}
              name="frequencyOfPayments"
              fielddata={KEY_TERMS_FRM.fields.frequencyOfPayments}
              changed={(e, result) => formChange(e, result, formName)}
            />
            <div className="field">
              <FormDropDown
                disabled={isReadonly}
                fielddata={KEY_TERMS_FRM.fields.securities}
                selection
                containerclassname="dropdown-field"
                value={KEY_TERMS_FRM.fields.securities.value}
                name="securities"
                options={SECURITIES_VALUES}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </div>
            <FormInput
              displayMode={isReadonly}
              name="securityInterest"
              fielddata={KEY_TERMS_FRM.fields.securityInterest}
              changed={(e, result) => formChange(e, result, formName)}
            />
            <MaskedInput
              displayMode={isReadonly}
              name="securitiesOwnershipPercentage"
              fielddata={KEY_TERMS_FRM.fields.securitiesOwnershipPercentage}
              changed={(values, name) => maskChange(values, formName, name)}
              percentage
            />
            {
              ['investmentMultiple', 'revSharePercentage', 'interestRate'].map(field => (
                <FormInput
                  displayMode={isReadonly}
                  key={field}
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, formName)}
                />
              ))
            }
            {
              ['minOfferingAmount', 'maxOfferingAmount'].map(field => (
                <MaskedInput
                  displayMode={isReadonly}
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  currency
                  prefix="$"
                />
              ))
            }
            <div className="field">
              <FormDropDown
                disabled={isReadonly}
                fielddata={KEY_TERMS_FRM.fields.legalBusinessType}
                selection
                containerclassname="dropdown-field"
                value={KEY_TERMS_FRM.fields.legalBusinessType.value}
                name="legalBusinessType"
                options={BUSINESS_TYPE_VALUES}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </div>
            {
              ['nsMinFees', 'nsMaxFees'].map(field => (
                <MaskedInput
                  displayMode={isReadonly}
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  currency
                  prefix="$"
                />
              ))
            }
            <FormInput
              displayMode={isReadonly}
              name="stockType"
              fielddata={KEY_TERMS_FRM.fields.stockType}
              changed={(e, result) => formChange(e, result, formName)}
            />
            {
              ['offeringExpTarget', 'offeringExpMax'].map(field => (
                <MaskedInput
                  displayMode={isReadonly}
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  currency
                  prefix="$"
                />
              ))
            }
            {
              ['locationRiskFactors', 'city', 'state', 'stateOfFormation'].map(field => (
                <FormInput
                  displayMode={isReadonly}
                  key={field}
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, formName)}
                />
              ))
            }
            {
              ['minInvestAmt', 'maxInvestAmt'].map(field => (
                <MaskedInput
                  displayMode={isReadonly}
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  currency
                  prefix="$"
                />
              ))
            }
            <FormInput
              displayMode={isReadonly}
              key="appendixATitle"
              name="appendixATitle"
              fielddata={KEY_TERMS_FRM.fields.appendixATitle}
              changed={(e, result) => formChange(e, result, formName)}
            />
          </Form.Group>
          {
            ['investmentMultipleSummary', 'revShareSummary', 'nsFeeCalcDescription'].map(field => (
              <FormTextarea
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
                containerclassname="secondary"
              />
            ))
          }
          <Form.Group widths="2">
            {
              ['isNewBusiness', 'isHealthcare', 'isFood', 'isAlcohol'].map(field => (
                <div className="field">
                  <Header as="label">{KEY_TERMS_FRM.fields[field].label}</Header>
                  <Form.Group inline>
                    <FormRadioGroup
                      disabled={isReadonly}
                      fielddata={KEY_TERMS_FRM.fields[field]}
                      name={field}
                      changed={(e, result) => formChange(e, result, formName)}
                    />
                  </Form.Group>
                </div>
              ))
            }
          </Form.Group>
          <DropZone
            disabled={isReadonly}
            name="uploadProformas"
            fielddata={KEY_TERMS_FRM.fields.uploadProformas}
            ondrop={(files, name) => this.onProFormasDrop(files, name)}
            onremove={fieldName => this.handleDelDoc(fieldName)}
            uploadtitle="Upload a file"
            containerclassname="field"
          />
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
