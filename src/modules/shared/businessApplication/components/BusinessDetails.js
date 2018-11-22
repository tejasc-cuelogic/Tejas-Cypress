import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Grid, Header, Divider, Form, Button, Icon, Accordion, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, DropZoneConfirm as DropZone, MaskedInput, FormDatePicker } from '../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';

@inject('businessAppStore')
@observer
export default class BusinessDetails extends Component {
  state = {
    showPartialSaveModal: false,
    currentForm: '',
    currentIndex: 0,
    legalNoteToggle: false,
  }

  componentWillMount() {
    this.props.businessAppStore.setFieldvalue('applicationStep', 'business-details');
  }

  removeForm = (e) => {
    this.setState({ showPartialSaveModal: !this.state.showPartialSaveModal });
    this.props.businessAppStore.removeForm(e, this.state.currentForm, this.state.currentIndex);
  }

  toggleHandel = () => {
    this.setState({ legalNoteToggle: !this.state.legalNoteToggle });
  }

  toggleConfirm = (formName, index) => {
    this.setState({
      ...this.state,
      showPartialSaveModal: !this.state.showPartialSaveModal,
      currentForm: formName,
      currentIndex: index,
    });
  }

  render() {
    const {
      BUSINESS_DETAILS_FRM, businessDetailsChange, businessAppUploadFiles,
      businessAppRemoveFiles, addMoreForms, businessDetailsMaskingChange,
      formReadOnlyMode, businessDetailsDateChange, currentApplicationType,
    } = this.props.businessAppStore;
    const { hideFields } = this.props;
    return (
      <div className={hideFields ? 'inner-content-spacer' : 'ui container'}>
        <Form className="issuer-signup">
          {!hideFields &&
            <FormElementWrap
              as="h1"
              header={`${currentApplicationType === 'business' ? 'Business' : 'Real Estate'} Details`}
              subHeader="Quickly, safely and accurately submit your business information."
            />
          }
          <FormElementWrap
            hideFields={hideFields}
            header={
              <Aux>
                Business Plan
                {!hideFields && currentApplicationType === 'business' &&
                  <Link to="/" className="link"><small>Learn More</small></Link>
                }
              </Aux>
            }
          >
            <DropZone
              hideFields={hideFields}
              tooltip={currentApplicationType === 'commercial-real-estate' ? 'Property description (as-is), related parties, legal/entity structure, control persons, sponsor/issuer overview, current capital stack (if applicable), proposed capital stack, source(s) of funds, uses of funds, debt assumptions, exit plan including targeted buyer,  construction, property management including day-to-day operations and services, leasing and marketing plans including target tenants and competitive position, potential regulatory restrictions.' : false}
              disabled={formReadOnlyMode}
              multiple
              name="businessPlan"
              fielddata={BUSINESS_DETAILS_FRM.fields.businessPlan}
              ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_DETAILS_FRM')}
              onremove={(fieldName, index) => businessAppRemoveFiles(fieldName, 'BUSINESS_DETAILS_FRM', index)}
            />
          </FormElementWrap>
          <FormElementWrap
            hideFields={hideFields}
            header="Existing Debt"
            subHeader="What are the outstanding debt obligations for the business?"
          >
            {BUSINESS_DETAILS_FRM.fields.debts.length &&
            BUSINESS_DETAILS_FRM.fields.debts.map((debt, index) => (
              <Grid>
                <Grid.Column largeScreen={14} computer={14} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    <Header as={hideFields ? 'h6' : 'h5'} className="mb-20">Existing Debt {index + 1}
                      {!hideFields && BUSINESS_DETAILS_FRM.fields.debts.length > 1 &&
                        <Button disabled={formReadOnlyMode} icon className="link-button pull-right" onClick={() => this.toggleConfirm('debts', index)}>
                          <Icon color="red" size="small" className="ns-trash" />
                        </Button>
                      }
                    </Header>
                    <Form.Group widths="equal">
                      <MaskedInput
                        showerror
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        prefix="$ "
                        currency
                        type="text"
                        name="amount"
                        fielddata={debt.amount}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                      />
                      <MaskedInput
                        showerror
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        percentage
                        type="text"
                        name="interestExpenses"
                        fielddata={debt.interestExpenses}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <MaskedInput
                        showerror
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        prefix="$ "
                        currency
                        type="text"
                        name="remainingPrincipal"
                        fielddata={debt.remainingPrincipal}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                      />
                      <MaskedInput
                        showerror
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        number
                        type="text"
                        name="term"
                        fielddata={debt.term}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                      />
                    </Form.Group>
                  </div>
                </Grid.Column>
              </Grid>
              ))
            }
            <Divider hidden />
            {!hideFields &&
              <Button disabled={formReadOnlyMode} size="tiny" onClick={e => addMoreForms(e, 'debts')} color="violet" className="ghost-button additional-field" content="+ Add additional debt" />
            }
          </FormElementWrap>
          <FormElementWrap
            hideFields={hideFields}
            noDivider={hideFields || formReadOnlyMode}
            header="Owners"
            subHeader="Please list all individuals with at least 20% ownership."
          >
            {!hideFields &&
              <Accordion>
                <Accordion.Title onClick={this.toggleHandel} active={this.state.legalNoteToggle}>
                  <Icon className="ns-chevron-up" />
                  {this.state.legalNoteToggle ? 'Hide' : 'Show'} legal note
                </Accordion.Title>
                <Accordion.Content active={this.state.legalNoteToggle}>
                  <p>
                    You hereby authorize NextSeed Management LLC, its assignee, assigns or
                    potential assigns to review your personal credit and business profile
                    provided by national credit bureaus in considering this application and
                    for the purpose of determining your eligibility to raise funds under an
                    applicable exemption provided by the U.S. Securities Act of 1933 and related
                    regulations. You hereby authorize the above listed parties to release all
                    credit information and bank information and you represent and warrant that all
                    information submitted to NextSeed Management LLC, including without limitation
                    information on this application, any attachments, any supplemental, or other
                    information herein is true, complete and accurate. You agree to immediately
                    notify NextSeed Management LLC if any of such information changes materially in
                    the 60 days after the date of this application. A fascimile, electronic or
                    other copy of this authorization shall be as valid as the original.<br />
                    NOTE: This will not impact your credit score. All information you provide
                    to us is strictly confidential and we will never disclose it to anyone
                    without your express consent unless required by applicable law or regulation
                  </p>
                </Accordion.Content>
              </Accordion>
            }
            {BUSINESS_DETAILS_FRM.fields.owners.length &&
            BUSINESS_DETAILS_FRM.fields.owners.map((owner, index) => (
              <Grid>
                <Grid.Column largeScreen={14} computer={14} tablet={16} mobile={16}>
                  <Header as={hideFields ? 'h6' : 'h5'}>Owner {index + 1}
                    {!hideFields && BUSINESS_DETAILS_FRM.fields.owners.length > 1 &&
                      <Button disabled={formReadOnlyMode} icon className="link-button pull-right" onClick={() => this.toggleConfirm('owners', index)}>
                        <Icon color="red" size="small" className="ns-trash" />
                      </Button>
                    }
                  </Header>
                  <div className="field-wrap">
                    <Form.Group widths="equal">
                      {
                        ['fullLegalName', 'title'].map(field => (
                          <FormInput
                            showerror
                            readOnly={formReadOnlyMode}
                            containerclassname={formReadOnlyMode ? 'display-only' : ''}
                            key={field}
                            type="text"
                            name={field}
                            fielddata={owner[field]}
                            changed={(e, res) => businessDetailsChange(e, res, 'owners', index)}
                          />
                        ))
                      }
                    </Form.Group>
                    <Form.Group widths="equal">
                      <MaskedInput
                        showerror
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        number
                        type="text"
                        name="yearsOfExp"
                        fielddata={owner.yearsOfExp}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'owners', index)}
                      />
                      <MaskedInput
                        showerror
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        percentage
                        type="text"
                        name="companyOwnerShip"
                        fielddata={owner.companyOwnerShip}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'owners', index)}
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <FormDatePicker
                        isdisabled={formReadOnlyMode}
                        type="text"
                        name="dateOfService"
                        maxDate={moment()}
                        placeholderText={owner.dateOfService.placeHolder}
                        fielddata={owner.dateOfService}
                        selected={owner.dateOfService.value ?
                          moment(owner.dateOfService.value, 'MM-DD-YYYY') : null}
                        changed={date => businessDetailsDateChange('dateOfService', date, index)}
                      />
                      <MaskedInput
                        showerror
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        ssn
                        type="text"
                        name="ssn"
                        fielddata={owner.ssn}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'owners', index)}
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <FormInput
                        showerror
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        type="text"
                        name="linkedInUrl"
                        fielddata={owner.linkedInUrl}
                        changed={(e, res) => businessDetailsChange(e, res, 'owners', index)}
                      />
                      <Form.Field>
                        <DropZone
                          hideFields={hideFields}
                          disabled={formReadOnlyMode}
                          name="resume"
                          fielddata={owner.resume}
                          ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_DETAILS_FRM', index)}
                          onremove={fieldName => businessAppRemoveFiles(fieldName, 'BUSINESS_DETAILS_FRM', index)}
                        />
                      </Form.Field>
                    </Form.Group>
                  </div>
                </Grid.Column>
              </Grid>
              ))
            }
            {!hideFields && BUSINESS_DETAILS_FRM.fields.owners.length !== 5 &&
              <Aux>
                <Divider hidden />
                <Button disabled={formReadOnlyMode} size="tiny" onClick={e => addMoreForms(e, 'owners')} color="violet" className="ghost-button additional-field" content="+ Add other owners" />
              </Aux>
            }
          </FormElementWrap>
          <AppNavigation hideFields={hideFields} />
        </Form>
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this ${this.state.currentForm}?`}
          open={this.state.showPartialSaveModal}
          onCancel={this.toggleConfirm}
          onConfirm={e => this.removeForm(e)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
