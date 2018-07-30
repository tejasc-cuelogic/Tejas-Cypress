import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Divider, Form, Button, Icon, Accordion, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, DropZone, MaskedInput2 } from '../../../../../theme/form';
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
      BUSINESS_DETAILS_FRM,
      businessDetailsChange,
      businessAppUploadFiles,
      businessAppRemoveFiles,
      addMoreForms,
      businessDetailsMaskingChange,
    } = this.props.businessAppStore;
    return (
      <Grid container>
        <Grid.Column>
          <Form className="issuer-signup">
            <FormElementWrap
              as="h1"
              header="Business Details"
              subHeader="Quickly, safely and accurately submit your business information."
            />
            <FormElementWrap
              header={
                <span>
                  Business Plan
                  <Link to="/" className="link"><small>Learn More</small></Link>
                </span>
              }
              subHeader="Upload your business plan"
            >
              <DropZone
                multiple
                name="businessPlan"
                fielddata={BUSINESS_DETAILS_FRM.fields.businessPlan}
                ondrop={(files, fieldName) =>
                  businessAppUploadFiles(files, fieldName, 'BUSINESS_DETAILS_FRM')}
                onremove={(e, fieldName, index) =>
                  businessAppRemoveFiles(e, fieldName, 'BUSINESS_DETAILS_FRM', index)}
              />
            </FormElementWrap>
            <FormElementWrap
              header="Existing Debt"
              subHeader="What are the outstanding debt obligations for the business?"
            >
              {BUSINESS_DETAILS_FRM.fields.debts.length &&
              BUSINESS_DETAILS_FRM.fields.debts.map((debt, index) => (
                <Grid>
                  <Grid.Column largeScreen={14} computer={14} tablet={16} mobile={16}>
                    <Header as="h5">
                      Existing Debt {index + 1}
                      {BUSINESS_DETAILS_FRM.fields.debts.length > 1 &&
                        <Button icon className="link-button pull-right" onClick={() => this.toggleConfirm('debts', index)}>
                          <Icon color="red" size="small" className="ns-trash" />
                        </Button>
                      }
                    </Header>
                    <div className="field-wrap">
                      <Form.Group widths="equal">
                        <MaskedInput2
                          currency
                          type="text"
                          name="amount"
                          fielddata={debt.amount}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                        />
                        <MaskedInput2
                          percentage
                          type="text"
                          name="interestExpenses"
                          fielddata={debt.interestExpenses}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <MaskedInput2
                          currency
                          type="text"
                          name="remainingPrincipal"
                          fielddata={debt.remainingPrincipal}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                        />
                        <MaskedInput2
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
              <Button size="tiny" onClick={e => addMoreForms(e, 'debts')} color="violet" className="ghost-button additional-field" content="+ Add additional debt" />
            </FormElementWrap>
            <FormElementWrap
              header="Owners"
              subHeader="Please list all individuals with at least 20% ownership."
            >
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
              {BUSINESS_DETAILS_FRM.fields.owners.length &&
              BUSINESS_DETAILS_FRM.fields.owners.map((owner, index) => (
                <Grid>
                  <Grid.Column largeScreen={14} computer={14} tablet={16} mobile={16}>
                    <Header as="h5">Owner {index + 1}
                      {BUSINESS_DETAILS_FRM.fields.owners.length > 1 &&
                        <Button icon className="link-button pull-right" onClick={() => this.toggleConfirm('owners', index)}>
                          <Icon color="red" size="small" className="ns-trash" />
                        </Button>
                      }
                    </Header>
                    <div className="field-wrap">
                      <Form.Group widths="equal">
                        <FormInput
                          type="text"
                          name="fullLegalName"
                          fielddata={owner.fullLegalName}
                          changed={(e, res) => businessDetailsChange(e, res, 'owners', index)}
                        />
                        <MaskedInput2
                          number
                          type="text"
                          name="yearsOfExp"
                          fielddata={owner.yearsOfExp}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, 'owners', index)}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <MaskedInput2
                          ssn
                          type="text"
                          name="ssn"
                          fielddata={owner.ssn}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, 'owners', index)}
                        />
                        <MaskedInput2
                          percentage
                          type="text"
                          name="companyOwnerShip"
                          fielddata={owner.companyOwnerShip}
                          changed={(values, field) => businessDetailsMaskingChange(field, values, 'owners', index)}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        {
                          ['linkedInUrl', 'title'].map(field => (
                            <FormInput
                              key={field}
                              type="text"
                              name={field}
                              fielddata={owner[field]}
                              changed={(e, res) => businessDetailsChange(e, res, 'owners', index)}
                            />
                          ))
                        }
                      </Form.Group>
                      <DropZone
                        name="resume"
                        fielddata={owner.resume}
                        ondrop={(files, fieldName) =>
                          businessAppUploadFiles(files, fieldName, 'BUSINESS_DETAILS_FRM', index)}
                        onremove={(e, fieldName) => businessAppRemoveFiles(e, fieldName, 'BUSINESS_DETAILS_FRM', index)}
                      />
                    </div>
                  </Grid.Column>
                </Grid>
                ))
              }
              <Divider hidden />
              {BUSINESS_DETAILS_FRM.fields.owners.length !== 5 &&
                <Button size="tiny" onClick={e => addMoreForms(e, 'owners')} color="violet" className="ghost-button additional-field" content="+ Add other owners" />
              }
            </FormElementWrap>
            <AppNavigation />
          </Form>
          <Confirm
            header="Confirm"
            content={`Are you sure you want to remove this ${this.state.currentForm}?`}
            open={this.state.showPartialSaveModal}
            onCancel={this.toggleConfirm}
            onConfirm={
              e => this.removeForm(e)}
            size="mini"
            className="deletion"
          />
        </Grid.Column>
      </Grid>
    );
  }
}
