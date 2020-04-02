import React, { Component } from 'react';
import { Header, Form, Divider, Icon, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { BUSINESS_INDUSTRIES, SECURITIES_VALUES, BUSINESS_TYPE_VALUES, REGULATION_VALUES, NS_FEE_PERCENTAGE } from '../../../../../services/constants/admin/offerings';
import { FormInput, MaskedInput, FormDropDown, FormTextarea, FormRadioGroup, DropZoneConfirm as DropZone } from '../../../../../theme/form';
import { InlineLoader } from '../../../../../theme/shared';
import ButtonGroupType2 from './ButtonGroupType2';
import HtmlEditor from '../../../../shared/HtmlEditor';

@inject('offeringCreationStore', 'uiStore', 'offeringsStore', 'userStore')
@observer
export default class KeyTerms extends Component {
  constructor(props) {
    super(props);
    this.props.offeringCreationStore.setFormData('KEY_TERMS_FRM', 'keyTerms');
    this.props.offeringCreationStore.setFormData('CLOSURE_SUMMARY_FRM', 'closureSummary.keyTerms');
  }

  onProFormasDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadData('KEY_TERMS_FRM', 'uploadProformas', files, '', null, 'KEY_TERMS_PROFORMAS', false, true);
  }

  onFileDrop = (files, name) => {
    this.props.offeringCreationStore.uploadFileToS3('KEY_TERMS_FRM', name, files);
  }

  handleDelDoc = (field) => {
    if (field === 'revShareSummaryUpload') {
      this.props.offeringCreationStore.removeFileFromS3('KEY_TERMS_FRM', field);
    } else {
      this.props.offeringCreationStore.removeUploadedDataMultiple('KEY_TERMS_FRM', field, null, '');
    }
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
    (field, value, form, index) => this.props.offeringCreationStore.rtEditorChange(field, value, form, 'additionalKeyterms', index);

  render() {
    const { offer, offerDataLoading } = this.props.offeringsStore;
    if (offerDataLoading) {
      return <InlineLoader />;
    }
    const {
      KEY_TERMS_FRM, CLOSURE_SUMMARY_FRM, formArrayChange, maskArrayChange,
      confirmModal, confirmModalName, removeData, currentOfferingId,
    } = this.props.offeringCreationStore;
    const formName = 'KEY_TERMS_FRM';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.keyTerms && offer.keyTerms.submitted)
      ? offer.keyTerms.submitted : null;
    const approved = (offer && offer.keyTerms && offer.keyTerms.approved)
      ? offer.keyTerms.approved : null;
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
                changed={(e, result) => formArrayChange(e, result, formName)}
              />
            ))}
            <FormDropDown
              displayMode={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.industry}
              selection
              value={KEY_TERMS_FRM.fields.industry.value}
              name="industry"
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              options={BUSINESS_INDUSTRIES}
              onChange={(e, result) => formArrayChange(e, result, formName)}
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
            />
            {['city', 'state'].map(field => (
              <FormInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formArrayChange(e, result, formName)}
              />
            ))}
            {['securities', 'equityClass', 'equityUnitType'].map(field => (
              <FormDropDown
                displayMode={isReadonly}
                containerclassname={isReadonly ? 'display-only' : ''}
                className={isReadonly ? 'display-only' : ''}
                disabled={isReadonly}
                fielddata={KEY_TERMS_FRM.fields[field]}
                selection
                value={KEY_TERMS_FRM.fields[field].value}
                name={field}
                placeholder={isReadonly ? 'N/A' : 'Choose here'}
                options={field === 'securities' ? SECURITIES_VALUES : KEY_TERMS_FRM.fields[field].values}
                onChange={(e, result) => formArrayChange(e, result, formName)}
              />
            ))}
            <MaskedInput
              displayMode={isReadonly}
              name="classThreshold"
              fielddata={KEY_TERMS_FRM.fields.classThreshold}
              changed={(values, name) => maskArrayChange(values, formName, name)}
              currency
              prefix="$"
            />
            {['minOfferingAmountCF', 'maxOfferingAmountCF'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(values, name) => maskArrayChange(values, formName, name)}
                currency
                prefix="$"
              />
            ))}
            <MaskedInput
              displayMode={isReadonly}
              name="minOfferingAmount506"
              fielddata={KEY_TERMS_FRM.fields.minOfferingAmount506 && KEY_TERMS_FRM.fields.minOfferingAmount506.value && KEY_TERMS_FRM.fields.minOfferingAmount506.value !== '0.00' ? KEY_TERMS_FRM.fields.minOfferingAmount506 : KEY_TERMS_FRM.fields.minOfferingAmount506C}
              changed={(values, name) => maskArrayChange(values, formName, name)}
              currency
              prefix="$"
            />
            <MaskedInput
              displayMode={isReadonly}
              name="maxOfferingAmount506"
              fielddata={KEY_TERMS_FRM.fields.maxOfferingAmount506 && KEY_TERMS_FRM.fields.maxOfferingAmount506.value && KEY_TERMS_FRM.fields.maxOfferingAmount506.value !== '0.00' ? KEY_TERMS_FRM.fields.maxOfferingAmount506 : KEY_TERMS_FRM.fields.maxOfferingAmount506C}
              changed={(values, name) => maskArrayChange(values, formName, name)}
              currency
              prefix="$"
            />
            <FormDropDown
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
              displayMode={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.legalBusinessType}
              selection
              value={KEY_TERMS_FRM.fields.legalBusinessType.value}
              name="legalBusinessType"
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              options={BUSINESS_TYPE_VALUES}
              onChange={(e, result) => formArrayChange(e, result, formName)}
            />
          </Form.Group>
          <Header as="h4">Key Terms</Header>
          <Form.Group widths={3}>
            {['maturity', 'startupPeriod'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(values, name) => maskArrayChange(values, formName, name)}
                number
              />
            ))}
            <FormDropDown
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
              displayMode={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.regulation}
              selection
              value={KEY_TERMS_FRM.fields.regulation.value}
              name="regulation"
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              options={REGULATION_VALUES}
              onChange={(e, result) => formArrayChange(e, result, formName)}
            />
            <FormInput
              displayMode={isReadonly}
              name="investmentMultiple"
              fielddata={KEY_TERMS_FRM.fields.investmentMultiple}
              changed={(e, result) => formArrayChange(e, result, formName)}
            />
            <MaskedInput
              displayMode={isReadonly}
              name="multiple"
              fielddata={CLOSURE_SUMMARY_FRM.fields.multiple}
              changed={(values, name) => maskArrayChange(values, 'CLOSURE_SUMMARY_FRM', name)}
              currency
            />
            <FormInput
              displayMode={isReadonly}
              name="revSharePercentage"
              fielddata={KEY_TERMS_FRM.fields.revSharePercentage}
              changed={(e, result) => formArrayChange(e, result, formName)}
            />
            <MaskedInput
              displayMode={isReadonly}
              name="interestRate"
              fielddata={KEY_TERMS_FRM.fields.interestRate}
              changed={(values, name) => maskArrayChange(values, formName, name)}
              percentage
            />
            <MaskedInput
              displayMode={isReadonly}
              name="minInvestAmt"
              fielddata={KEY_TERMS_FRM.fields.minInvestAmt}
              changed={(values, name) => maskArrayChange(values, formName, name)}
              currency
              prefix="$"
            />
            <FormInput
              displayMode={isReadonly}
              name="securityInterest"
              fielddata={KEY_TERMS_FRM.fields.securityInterest}
              changed={(e, result) => formArrayChange(e, result, formName)}
            />
            <MaskedInput
              displayMode={isReadonly}
              name="securitiesOwnershipPercentage"
              fielddata={KEY_TERMS_FRM.fields.securitiesOwnershipPercentage}
              changed={(values, name) => maskArrayChange(values, formName, name)}
              percentage
            />
            <FormInput
              displayMode={isReadonly}
              name="frequencyOfPayments"
              fielddata={KEY_TERMS_FRM.fields.frequencyOfPayments}
              changed={(e, result) => formArrayChange(e, result, formName)}
            />
            {/* <FormDropDown
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
              displayMode={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.roundType}
              selection
              value={KEY_TERMS_FRM.fields.roundType.value}
              name="roundType"
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              options={ROUND_TYPE_VALUES}
              onChange={(e, result) => formArrayChange(e, result, formName)}
            /> */}
            <MaskedInput
              displayMode={isReadonly}
              name="totalRoundSize"
              fielddata={KEY_TERMS_FRM.fields.totalRoundSize}
              changed={(values, name) => maskArrayChange(values, formName, name)}
              currency
              prefix="$"
            />
            <FormInput
              displayMode={isReadonly}
              name="priceCopy"
              fielddata={KEY_TERMS_FRM.fields.priceCopy}
              changed={(e, result) => formArrayChange(e, result, formName)}
            />
            <MaskedInput
              displayMode={isReadonly}
              name="priceCalculation"
              fielddata={CLOSURE_SUMMARY_FRM.fields.priceCalculation}
              changed={(values, name) => maskArrayChange(values, 'CLOSURE_SUMMARY_FRM', name)}
              currency
              prefix="$"
            />
            <MaskedInput
              displayMode={isReadonly}
              name="premoneyValuation"
              fielddata={KEY_TERMS_FRM.fields.premoneyValuation}
              changed={(values, name) => maskArrayChange(values, 'KEY_TERMS_FRM', name)}
              currency
              prefix="$"
            />
            {
              ['valuationCap', 'discount'].map(field => (
                <FormInput
                  displayMode={isReadonly}
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(e, result) => formArrayChange(e, result, formName)}
                />
              ))
            }
            {
              ['offeringSize', 'preferredReturn', 'targetInvestmentPeriod'].map(field => (
                <MaskedInput
                  displayMode={isReadonly}
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskArrayChange(values, formName, name)}
                  currency={field === 'offeringSize'}
                  number={field === 'targetInvestmentPeriod'}
                  percentage={field === 'preferredReturn'}
                  prefix={field === 'offeringSize' ? '$' : ''}
                />
              ))
            }
          </Form.Group>
          <Form.Group widths={2}>
            {['investmentMultipleSummary', 'offeringDisclaimer', 'revShareSummary', 'revSharePercentageDescription'].map(field => (
              <Form.Field>
                <Header as="h6">{KEY_TERMS_FRM.fields[field].label}</Header>
                <HtmlEditor
                  imageUploadPath={`offerings/${currentOfferingId}`}
                  readOnly={isReadonly}
                  changed={this.editorChange}
                  name={field}
                  form={formName}
                  content={field !== 'offeringDisclaimer' ? KEY_TERMS_FRM.fields[field].value : KEY_TERMS_FRM.fields[field].value || KEY_TERMS_FRM.fields[field].defaultValue}
                />
              </Form.Field>
            ))}
          </Form.Group>
          <Header as="h4">
            Additional Key Terms
            {!isReadonly
              && <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'additionalKeyterms')}><small>+ Add New Term</small></Link>
            }
          </Header>
          {KEY_TERMS_FRM.fields.additionalKeyterms.map((field, index) => (
            <>
              <Header as="h6">{`Term ${index + 1}`}
                {KEY_TERMS_FRM.fields.additionalKeyterms.length > 1
                  && (
                    <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'additionalKeyterms')}>
                      <Icon className="ns-close-circle" color="grey" />
                    </Link>
                  )
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
                    imageUploadPath={`offerings/${currentOfferingId}`}
                    readOnly={isReadonly}
                    changed={this.editorChange}
                    name="description"
                    form={formName}
                    index={index}
                    content={field.description.value}
                  />
                </Form.Field>
              </div>
            </>
          ))}
          <Header as="h4">Legal</Header>
          <Form.Group widths={3}>
            {['locationRiskFactors', 'stateOfFormation', 'appendixATitle'].map(field => (
              <FormInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formArrayChange(e, result, formName)}
              />
            ))}
            <FormInput
              displayMode={isReadonly}
              name="stockType"
              fielddata={KEY_TERMS_FRM.fields.stockType}
              changed={(e, result) => formArrayChange(e, result, formName)}
            />
            {['nsMinFees', 'nsMaxFees'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(values, name) => maskArrayChange(values, formName, name)}
                currency
                prefix="$"
              />
            ))}
            {['totalProjectCost', 'raisedThroughSaleOfEquity'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(values, name) => maskArrayChange(values, formName, name)}
                currency
                prefix="$"
              />
            ))}
            <FormDropDown
              containerclassname={isReadonly ? 'display-only' : ''}
              className={isReadonly ? 'display-only' : ''}
              displayMode={isReadonly}
              fielddata={KEY_TERMS_FRM.fields.nsFeePercentage}
              selection
              value={KEY_TERMS_FRM.fields.nsFeePercentage.value}
              name="nsFeePercentage"
              placeholder={isReadonly ? 'N/A' : 'Choose here'}
              options={NS_FEE_PERCENTAGE}
              onChange={(e, result) => formArrayChange(e, result, formName)}
            />
          </Form.Group>
          <Form.Group widths={2}>
            {['useOfProceedFootnote', 'currentFinancialStatements'].map(field => (
              <FormTextarea
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formArrayChange(e, result, formName)}
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
                  changed={(e, result) => formArrayChange(e, result, formName)}
                />
              </div>
            ))}
            {['isAlcohol', 'isFood'].map(field => (
              <div className={!isReadonly ? 'field' : 'field display-only'}>
                <Header as="label">{KEY_TERMS_FRM.fields[field].label}</Header>
                <FormRadioGroup
                  containerclassname={isReadonly ? 'display-only' : ''}
                  readOnly={isReadonly}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  name={field}
                  changed={(e, result) => formArrayChange(e, result, formName)}
                />
              </div>
            ))}
            {['uploadProformas', 'revShareSummaryUpload'].map(field => (
              <DropZone
                disabled={isReadonly}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                ondrop={(files, name) => (field === 'uploadProformas' ? this.onProFormasDrop(files, name) : this.onFileDrop(files, name))}
                onremove={fieldName => this.handleDelDoc(fieldName)}
                uploadtitle="Upload a file"
                containerclassname={!isReadonly ? 'field' : 'field display-only'}
              />
            ))
            }
          </Form.Group>
          <Divider hidden />
          <ButtonGroupType2
            submitted={submitted}
            isManager={isManager}
            approved={approved}
            loading={offerDataLoading}
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
