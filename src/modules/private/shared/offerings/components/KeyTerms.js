import React, { Component } from 'react';
import { Header, Form, Button, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { BUSINESS_INDUSTRIES, SECURITIES_VALUES, BUSINESS_TYPE_VALUES } from '../../../../../services/constants/admin/offerings';
import { FormInput, MaskedInput, FormDropDown, FormTextarea, FormRadioGroup, DropZone } from '../../../../../theme/form';

@inject('offeringCreationStore', 'uiStore')
@observer
export default class KeyTerms extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('KEY_TERMS_FRM', 'keyTerms');
  }
  onProFormasDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadData('KEY_TERMS_FRM', 'proFormas', files);
  }
  confirmRemoveDoc = (e, name) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  handleDelDoc = (field) => {
    this.props.offeringCreationStore.removeUploadedData('KEY_TERMS_FRM', field);
    this.props.uiStore.setConfirmBox('');
  }
  render() {
    const { KEY_TERMS_FRM, formChange, maskChange } = this.props.offeringCreationStore;
    const { confirmBox } = this.props.uiStore;
    const formName = 'KEY_TERMS_FRM';
    return (
      <div className="inner-content-spacer">
        <Header as="h4">Basic</Header>
        <Form>
          <Form.Group widths="3">
            {
            ['legalBusinessName', 'shorthandBusinessName'].map(field => (
              <FormInput
                key={field}
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
              />
            ))
            }
            <div className="field">
              <FormDropDown
                fielddata={KEY_TERMS_FRM.fields.industry}
                selection
                containerclassname="dropdown-field"
                value={KEY_TERMS_FRM.fields.industry.value}
                name="industry"
                options={BUSINESS_INDUSTRIES}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </div>
            {
            ['maturity', 'frequencyOfPayments'].map(field => (
              <MaskedInput
                name={field}
                fielddata={KEY_TERMS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, formName, name)}
                number
              />
            ))
            }
            <MaskedInput
              name="terminationDate"
              fielddata={KEY_TERMS_FRM.fields.terminationDate}
              format="##-##-####"
              changed={(values, field) => maskChange(values, formName, field)}
              dateOfBirth
            />
            <div className="field">
              <FormDropDown
                fielddata={KEY_TERMS_FRM.fields.securities}
                selection
                containerclassname="dropdown-field"
                value={KEY_TERMS_FRM.fields.securities.value}
                name="securities"
                options={SECURITIES_VALUES}
                onChange={(e, result) => formChange(e, result, formName)}
              />
            </div>
            {
              ['securityInterest', 'ownership'].map(field => (
                <MaskedInput
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  percentage
                />
              ))
            }
            <FormInput
              key="investmentMultiple"
              name="investmentMultiple"
              fielddata={KEY_TERMS_FRM.fields.investmentMultiple}
              changed={(e, result) => formChange(e, result, formName)}
            />
            {
              ['revSharePercentage', 'interestRate'].map(field => (
                <MaskedInput
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  percentage={field !== 'investmentMuliple'}
                  number={field === 'investmentMuliple'}
                />
              ))
            }
            {
              ['minOfferingAmount', 'maxOfferingAmount'].map(field => (
                <MaskedInput
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
              ['nsMinFees', 'nsMaxFees', 'gsFees'].map(field => (
                <MaskedInput
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  currency
                  prefix="$"
                />
              ))
            }
            {
              ['stateOfFormation', 'city', 'state'].map(field => (
                <FormInput
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
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  currency
                  prefix="$"
                />
              ))
            }
            <FormInput
              name="stockType"
              fielddata={KEY_TERMS_FRM.fields.stockType}
              changed={(e, result) => formChange(e, result, formName)}
            />
            {
              ['offeringExpTarget', 'offeringExpMax'].map(field => (
                <MaskedInput
                  name={field}
                  fielddata={KEY_TERMS_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                  currency
                  prefix="$"
                />
              ))
            }
          </Form.Group>
          {
            ['revShareSummary', 'nsFeeCalcDescription'].map(field => (
              <FormTextarea
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
            name="proFormas"
            fielddata={KEY_TERMS_FRM.fields.proFormas}
            ondrop={this.onProFormasDrop}
            onremove={this.confirmRemoveDoc}
            uploadtitle="Upload a file"
          />
          <Button color="green" primary disabled={!KEY_TERMS_FRM.meta.isValid} className="pull-right very relaxed">Save</Button>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'proFormas'}
          onCancel={this.handleDelCancel}
          onConfirm={() => this.handleDelDoc(confirmBox.entity)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
