import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Header, Form, Accordion, Icon, Button, Confirm, Divider } from 'semantic-ui-react';
import { FormInput, FormDropDown, MaskedInput } from '../../../../../../../../theme/form';
import { BD_REGULATION_VALUES, BUSINESS_TYPE_VALUES } from '../../../../../../../../services/constants/admin/offerings';
import Helper from '../../../../../../../../helper/utility';
import Contingencies from '../Contingencies';

export const options = [
  { key: 'Yes', value: 'YES', text: 'Yes' },
  { key: 'No', value: 'NO', text: 'No' },
];

@inject('businessAppReviewStore', 'uiStore')
@observer
export default class BusinessApplicationMapping extends Component {
  state = { activeIndex: [0, 1, 2, 3], isSsnDirty: [] };

  constructor(props) {
    super(props);
    this.props.businessAppReviewStore.setFormData('APPLICATION_MAPPED_OFFERING_FORM');
  }

  toggleAccordianContent = (categoryIndex = null) => {
    const index = categoryIndex;
    const { activeIndex } = this.state;
    const newIndex = activeIndex;

    const currentIndexPosition = activeIndex.indexOf(index);
    if (currentIndexPosition > -1) {
      newIndex.splice(currentIndexPosition, 1);
    } else {
      newIndex.push(index);
    }

    this.setState({ activeIndex: newIndex });
  };

  handleSsnChange = (e, res, formName, subForm, index) => {
    e.preventDefault();
    this.props.businessAppReviewStore.businessDetailsChange(e, { name: 'ssn', value: '' }, formName, subForm, index);
    const a = this.state.isSsnDirty.slice();
    a[index] = true;
    this.setState({ isSsnDirty: a });
  }

  change = (e, result, formName, field) => {
    this.props.businessAppReviewStore.formArrayChange(e, result, formName);
    this.props.businessAppReviewStore.offerCreateChange(formName, field);
  }

  submit = () => {
    this.props.businessAppReviewStore.createBusinessOffering('APPLICATION_MAPPED_OFFERING_FORM');
  }

  toggleConfirmModal = (e, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(null, formName);
  }

  render() {
    const { activeIndex } = this.state;
    const formName = 'APPLICATION_MAPPED_OFFERING_FORM';
    const { inProgress } = this.props.uiStore;
    const {
      APPLICATION_MAPPED_OFFERING_FORM,
      formArrayChange,
      businessDetailsDateChange,
      businessDetailsChange,
      businessDetailsMaskingChange,
      confirmModal,
    } = this.props.businessAppReviewStore;
    let MODIFIED_REGULATION_VALUES = null;
    if (APPLICATION_MAPPED_OFFERING_FORM && APPLICATION_MAPPED_OFFERING_FORM.fields && APPLICATION_MAPPED_OFFERING_FORM.fields.regulation
      && APPLICATION_MAPPED_OFFERING_FORM.fields.regulation.value) {
      MODIFIED_REGULATION_VALUES = BD_REGULATION_VALUES;
    } else {
      // MODIFIED_REGULATION_VALUES = REGULATION_VALUES;
      MODIFIED_REGULATION_VALUES = BD_REGULATION_VALUES;
    }
    const isReadonly = this.props.isReadOnlyFlag;
    if (isReadonly) {
       return null;
    }
    return (
      <>
        <Form className="mt-50">
          <Header as="h4">Business Application Mapping</Header>
          <Accordion exclusive={false} fluid styled className="card-style mt-20 overflow-visible">
            <Accordion.Title onClick={() => this.toggleAccordianContent(0)}>
              <Icon className={activeIndex.includes(0) ? 'ns-chevron-up' : 'ns-chevron-down'} />
              Key Term
          </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(0)} className="categories-acc">
              <Form.Group widths={2}>
                {
                  ['businessName', 'shorthandBusinessName', 'offeringSlug'].map(field => (
                    <FormInput
                      key={field}
                      name={field}
                      fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields[field]}
                      changed={(e, result) => this.change(e, result, formName, field)}
                    />
                  ))
                }
                <FormDropDown
                  fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields.businessEntityStructure}
                  selection
                  value={APPLICATION_MAPPED_OFFERING_FORM.fields.businessEntityStructure.value}
                  name="businessEntityStructure"
                  placeholder="Choose here"
                  options={BUSINESS_TYPE_VALUES}
                  onChange={(e, result) => formArrayChange(e, result, formName)}
                />
                <FormDropDown
                  fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields.regulation}
                  selection
                  value={APPLICATION_MAPPED_OFFERING_FORM.fields.regulation.value}
                  name="regulation"
                  placeholder="Choose here"
                  options={MODIFIED_REGULATION_VALUES}
                  onChange={(e, result) => formArrayChange(e, result, formName)}
                />
              </Form.Group>
            </Accordion.Content>
          </Accordion>
          <Accordion exclusive={false} fluid styled className="card-style overflow-visible">
            <Accordion.Title onClick={() => this.toggleAccordianContent(1)}>
              <Icon className={activeIndex.includes(1) ? 'ns-chevron-up' : 'ns-chevron-down'} />
              Legal
          </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(1)} className="categories-acc">
              <Form.Group widths={2}>
                {['website', 'number', 'street', 'city', 'state', 'zipCode'].map(field => (
                  <FormInput
                    key={field}
                    name={field}
                    fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields[field]}
                    changed={(e, result) => formArrayChange(e, result, formName)}
                  />
                ))}
                <FormDropDown
                  fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields.companyTaxed}
                  selection
                  value={APPLICATION_MAPPED_OFFERING_FORM.fields.companyTaxed.value}
                  name="companyTaxed"
                  placeholder="Choose here"
                  options={APPLICATION_MAPPED_OFFERING_FORM.fields.companyTaxed.values}
                  onChange={(e, result) => formArrayChange(e, result, formName)}
                />
                </Form.Group>
                <FormDropDown
                  fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields.fundUsage}
                  multiple
                  selection
                  fluid
                  name="fundUsage"
                  containerclassname="dropdown-field"
                  options={APPLICATION_MAPPED_OFFERING_FORM.fields.fundUsage.values}
                  onChange={(e, result) => formArrayChange(e, result, formName, '', '', undefined, 'dropdown')}
                />
                <Divider hidden />
                {APPLICATION_MAPPED_OFFERING_FORM.fields.debts.length
                  && APPLICATION_MAPPED_OFFERING_FORM.fields.debts.map((debt, index) => (
                    <>
                    <Header as="h4">{`Existing Debt ${index + 1}`}</Header>
                      <Form.Group widths={2}>
                        {['termStartDate', 'maturityDate'].map(field => (
                          <MaskedInput
                            name={field}
                            fielddata={debt[field]}
                            format="##/##/####"
                            changed={values => businessDetailsDateChange(field, values.formattedValue, index, formName, 'debts')}
                            dateOfBirth
                          />
                        ))}
                        <FormInput
                          name="creditorName"
                          fielddata={debt.creditorName}
                          changed={(e, res) => businessDetailsChange(e, res, formName, 'debts', index)}
                        />
                        <FormDropDown
                          name="existingLienOnBusiness"
                          placeholder="Choose here"
                          fluid
                          selection
                          fielddata={debt.existingLienOnBusiness}
                          options={options}
                          onChange={(e, result) => formArrayChange(e, result, formName, 'debts', index)}
                        />
                        <MaskedInput
                          prefix="$ "
                          currency
                          type="text"
                          name="amount"
                          fielddata={debt.amount}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, formName, 'debts', index)}
                        />
                        <MaskedInput
                          prefix="$ "
                          currency
                          type="text"
                          name="remainingPrincipal"
                          fielddata={debt.remainingPrincipal}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, formName, 'debts', index)}
                        />
                        <MaskedInput
                          percentage
                          type="text"
                          name="interestExpenses"
                          fielddata={debt.interestExpenses}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, formName, 'debts', index)}
                        />
                      </Form.Group>
                    <Divider hidden />
                    </>
                  ))}
            </Accordion.Content>
          </Accordion>
          <Accordion exclusive={false} fluid styled className="card-style">
            <Accordion.Title onClick={() => this.toggleAccordianContent(2)}>
              <Icon className={activeIndex.includes(2) ? 'ns-chevron-up' : 'ns-chevron-down'} />
              Leadership
          </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(2)} className="categories-acc">
                {APPLICATION_MAPPED_OFFERING_FORM.fields.owners.length
                  && APPLICATION_MAPPED_OFFERING_FORM.fields.owners.map((owner, index) => {
                    const ssnData = owner.ssn.value !== null && owner.ssn.value.length === 9 ? Helper.encrypSsnNumberByForm(owner).ssn : owner.ssn;
                    return (
                    <>
                      <Header as="h4">{`Leader ${index + 1}`}</Header>
                        <Form.Group widths={2}>
                        {['fullLegalName', 'title'].map(field => (
                          <FormInput
                            // readOnly={formReadOnlyMode}
                            // containerclassname={formReadOnlyMode ? 'display-only' : ''}
                            key={field}
                            type="text"
                            asterisk="true"
                            name={field}
                            fielddata={owner[field]}
                            changed={(e, res) => businessDetailsChange(e, res, formName, 'owners', index)}
                          />
                        ))}
                        <MaskedInput
                          // readOnly={formReadOnlyMode}
                          // containerclassname={formReadOnlyMode ? 'display-only' : ''}
                          number
                          type="text"
                          name="yearsOfExp"
                          asterisk="true"
                          fielddata={owner.yearsOfExp}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, formName, 'owners', index)}
                        />
                        <MaskedInput
                          // readOnly={formReadOnlyMode}
                          // containerclassname={formReadOnlyMode ? 'display-only' : ''}
                          percentage
                          type="text"
                          asterisk="true"
                          name="companyOwnerShip"
                          fielddata={owner.companyOwnerShip}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, formName, 'owners', index)}
                        />
                        <MaskedInput
                          // readOnly={formReadOnlyMode}
                          // containerclassname={formReadOnlyMode ? 'display-only' : ''}
                          name="dateOfService"
                          fielddata={owner.dateOfService}
                          asterisk="true"
                          format="##/##/####"
                          label="Start Date with the Business"
                          changed={values => businessDetailsDateChange('dateOfService', values.formattedValue, index, formName, 'owners')}
                          dateOfBirth
                        />
                        {ssnData.value && ssnData.value.includes('X') && !this.state.isSsnDirty[index]
                          ? (
                            <FormInput
                              // displayMode={formReadOnlyMode}
                              // asterisk={formReadOnlyMode ? 'false' : 'true'}
                              key="ssn"
                              name="ssn"
                              fielddata={Helper.encrypSsnNumberByForm(owner).ssn}
                              onChange={(e, res) => this.handleSsnChange(e, res, formName, 'owners', index)}
                            />
                          )
                          : (
                            <MaskedInput
                              // readOnly={formReadOnlyMode}
                              // containerclassname={formReadOnlyMode ? 'display-only' : ''}
                              ssn
                              name="ssn"
                              asterisk="true"
                              fielddata={owner.ssn}
                              changed={(values, field) => businessDetailsMaskingChange(field, values, formName, 'owners', index)}
                            />
                          )}
                        <FormInput
                          // readOnly={formReadOnlyMode}
                          // containerclassname={formReadOnlyMode ? 'display-only' : ''}
                          type="text"
                          name="linkedInUrl"
                          fielddata={owner.linkedInUrl}
                          changed={(e, res) => businessDetailsChange(e, res, formName, 'owners', index)}
                        />
                      </Form.Group>
                      </>
                    );
                  })
                }
            </Accordion.Content>
          </Accordion>
          <Accordion exclusive={false} fluid styled className="card-style">
            <Accordion.Title onClick={() => this.toggleAccordianContent(3)}>
              <Icon className={activeIndex.includes(3) ? 'ns-chevron-up' : 'ns-chevron-down'} />
              Contingencies
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(3)} className="categories-acc">
              <Contingencies {...this.props} hideButtonGroup />
            </Accordion.Content>
          </Accordion>
          <div className="right-align mt-20">
            <Button disabled={!APPLICATION_MAPPED_OFFERING_FORM.meta.isValid || inProgress} loading={inProgress} primary className="relaxed" onClick={e => this.toggleConfirmModal(e, formName)}>Create Offering</Button>
          </div>
        </Form>
        <Confirm
          header="Confirm"
          content="This action can only be triggered once, and will be created with the values
          currently defined. Are you sure you want to create this offering at this time?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.submit()}
          size="mini"
          className="deletion"
        />
      </>
    );
  }
}
