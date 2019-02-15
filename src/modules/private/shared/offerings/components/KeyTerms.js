import React, { Component } from 'react';
import { Header, Form, Divider, Icon, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { startsWith } from 'lodash';
import { BUSINESS_INDUSTRIES, SECURITIES_VALUES, BUSINESS_TYPE_VALUES, ROUND_TYPE_VALUES, REGULATION_VALUES, BD_REGULATION_VALUES, FP_REGULATION_VALUES } from '../../../../../services/constants/admin/offerings';
import { FormInput, MaskedInput, FormDropDown, FormTextarea, FormRadioGroup, DropZoneConfirm as DropZone } from '../../../../../theme/form';
import ButtonGroupType2 from './ButtonGroupType2';
import HtmlEditor from '../../../../shared/HtmlEditor';

@inject('offeringCreationStore', 'uiStore', 'offeringsStore', 'userStore')
@observer
export default class KeyTerms extends Component {
  componentWillMount() {
    // this.props.offeringCreationStore.setFormData('KEY_TERMS_FRM', 'keyTerms');
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
  addMore = (e, formName, arrayName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, arrayName);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  editorChange =
  (field, value, form) => this.props.offeringCreationStore.rtEditorChange(field, value, form);
  render() {
    const {
      KEY_TERMS_FRM, formChange, maskChange, formArrayChange,
      confirmModal, confirmModalName, removeData,
    } = this.props.offeringCreationStore;
    const formName = 'KEY_TERMS_FRM';
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.keyTerms && offer.keyTerms.submitted) ?
      offer.keyTerms.submitted : null;
    const approved = (offer && offer.keyTerms && offer.keyTerms.approved) ?
      offer.keyTerms.approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    let MODIFIED_REGULATION_VALUES = null;
    if (KEY_TERMS_FRM && KEY_TERMS_FRM.fields && KEY_TERMS_FRM.fields.regulation
      && KEY_TERMS_FRM.fields.regulation.value) {
      MODIFIED_REGULATION_VALUES = startsWith(KEY_TERMS_FRM.fields.regulation.value, 'BD_') ? BD_REGULATION_VALUES : FP_REGULATION_VALUES;
    } else {
      MODIFIED_REGULATION_VALUES = REGULATION_VALUES;
    }
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
              options={MODIFIED_REGULATION_VALUES}
              onChange={(e, result) => formChange(e, result, formName)}
            />
            {['investmentMultiple', 'revSharePercentage', 'interestRate'].map(field => (
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
            <FormInput
              displayMode={isReadonly}
              name="frequencyOfPayments"
              fielddata={KEY_TERMS_FRM.fields.frequencyOfPayments}
              changed={(e, result) => formChange(e, result, formName)}
            />
            <FormDropDown
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
              disabled={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.roundType}
              selection
              value={KEY_TERMS_FRM.fields.roundType.value}
              name="roundType"
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              options={ROUND_TYPE_VALUES}
              onChange={(e, result) => formChange(e, result, formName)}
            />
            {['unitPrice', 'premoneyValuation'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, formName, name)}
                currency
                prefix="$"
              />
            ))}
          </Form.Group>
          <Form.Group widths={2}>
            {['investmentMultipleSummary', 'offeringDisclaimer', 'revShareSummary', 'revSharePercentageDescription'].map(field => (
              <Form.Field>
                <Header as="h6">{KEY_TERMS_FRM.fields[field].label}</Header>
                <HtmlEditor
                  readOnly={isReadonly}
                  changed={this.editorChange}
                  name={field}
                  form={formName}
                  content={KEY_TERMS_FRM.fields[field].value}
                />
              </Form.Field>
            ))}
          </Form.Group>
          <Header as="h4">
            Additional Key Terms
            {!isReadonly &&
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'additionalKeyterms')}><small>+ Add New Term</small></Link>
            }
          </Header>
          {KEY_TERMS_FRM.fields.additionalKeyterms.map((field, index) => (
            <Aux>
              <Header as="h6">{`Term ${index + 1}`}
                {KEY_TERMS_FRM.fields.additionalKeyterms.length > 1 &&
                <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'additionalKeyterms')} >
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
                }
              </Header>
              <div className="featured-section">
                <FormInput
                  displayMode={isReadonly}
                  name="label"
                  fielddata={field.label}
                  changed={(e, result) => formArrayChange(e, result, formName, 'additionalKeyterms', index)}
                />
                <Form.Field>
                  <Header as="h6">{field.description.label}</Header>
                  <HtmlEditor
                    readOnly={isReadonly}
                    changed={this.editorChange}
                    name="description"
                    form={formName}
                    content={field.description.value}
                  />
                </Form.Field>
              </div>
            </Aux>
          ))}
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
            {['nsMinFees', 'nsMaxFees'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, formName, name)}
                currency
                prefix="$"
              />
            ))}
            <FormInput
              displayMode={isReadonly}
              name="stockType"
              fielddata={KEY_TERMS_FRM.fields.stockType}
              changed={(e, result) => formChange(e, result, formName)}
            />
          </Form.Group>
          <Form.Group widths={2}>
            {['useOfProceedFootnote', 'currentFinancialStatements'].map(field => (
              <FormTextarea
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
                containerclassname="secondary large"
              />
            ))}
          </Form.Group>
          <Form.Group widths={3}>
            {['isNewBusiness', 'isHealthcare'].map(field => (
              <div className={!isReadonly ? 'field' : 'field display-only'}>
                <Header as="label">{KEY_TERMS_FRM.fields[field].label}</Header>
                <FormRadioGroup
                  readOnly={isReadonly}
                  containerclassname={isReadonly ? 'display-only' : ''}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  name={field}
                  changed={(e, result) => formChange(e, result, formName)}
                />
              </div>
            ))}
            <DropZone
              disabled={isReadonly}
              name="uploadProformas"
              fielddata={KEY_TERMS_FRM.fields.uploadProformas}
              ondrop={(files, name) => this.onProFormasDrop(files, name)}
              onremove={fieldName => this.handleDelDoc(fieldName)}
              uploadtitle="Upload a file"
              containerclassname={!isReadonly ? 'field' : 'field display-only'}
            />
            {['isAlcohol', 'isFood'].map(field => (
              <div className={!isReadonly ? 'field' : 'field display-only'}>
                <Header as="label">{KEY_TERMS_FRM.fields[field].label}</Header>
                <FormRadioGroup
                  containerclassname={isReadonly ? 'display-only' : ''}
                  readOnly={isReadonly}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  name={field}
                  changed={(e, result) => formChange(e, result, formName)}
                />
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
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this Term"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData('KEY_TERMS_FRM', confirmModalName)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
