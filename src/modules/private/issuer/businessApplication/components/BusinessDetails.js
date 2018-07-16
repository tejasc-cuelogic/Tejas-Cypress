import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Divider, Form, Button, Icon, Accordion } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, DropZone, MaskedInput2 } from '../../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';
// import Helper from '../../../../helper/utility';

@inject('newBusinessStore')
@observer
export default class BusinessDetails extends Component {
  submit = () => {
    // e.preventDefault();
    console.log(111);
  }
  render() {
    const {
      BUSINESS_DETAILS_FRM,
      businessDetailsChange,
      businessDetailsFiles,
      businessDetailsReset,
      addMoreForms,
      removeForm,
      businessDetailsMaskingChange,
    } = this.props.newBusinessStore;
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
                ondrop={businessDetailsFiles}
                onremove={businessDetailsReset}
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
                    <Header as="h3">
                      Existing Debt {index + 1}
                      {BUSINESS_DETAILS_FRM.fields.debts.length > 1 &&
                        <Button icon className="link-button pull-right" onClick={e => removeForm(e, 'debts', index)}>
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
                          changed={values => businessDetailsMaskingChange('amount', values, 'debts', index)}
                        />
                        <MaskedInput2
                          percentage
                          type="text"
                          name="interestExpenses"
                          fielddata={debt.interestExpenses}
                          changed={values => businessDetailsMaskingChange('interestExpenses', values, 'debts', index)}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <MaskedInput2
                          currency
                          type="text"
                          name="remainingPrincipal"
                          fielddata={debt.remainingPrincipal}
                          changed={values => businessDetailsMaskingChange('remainingPrincipal', values, 'debts', index)}
                        />
                        <MaskedInput2
                          number
                          type="text"
                          name="term"
                          fielddata={debt.term}
                          changed={values => businessDetailsMaskingChange('term', values, 'debts', index)}
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
                <Accordion.Title active>
                  <Icon className="ns-chevron-up" />
                  Hide legal note
                </Accordion.Title>
                <Accordion.Content active>
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
                    <Header as="h3">Owner {index + 1}
                      {BUSINESS_DETAILS_FRM.fields.owners.length > 1 &&
                        <Button icon className="link-button pull-right" onClick={e => removeForm(e, 'owners', index)}>
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
                          changed={values => businessDetailsMaskingChange('yearsOfExp', values, 'owners', index)}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <MaskedInput2
                          number
                          type="text"
                          name="ssn"
                          fielddata={owner.ssn}
                          changed={values => businessDetailsMaskingChange('ssn', values, 'owners', index)}
                        />
                        <MaskedInput2
                          percentage
                          type="text"
                          name="companyOwnerShip"
                          fielddata={owner.companyOwnerShip}
                          changed={values => businessDetailsMaskingChange('companyOwnerShip', values, 'owners', index)}
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
                          businessDetailsFiles(files, fieldName, index)}
                        onremove={(e, fieldName) => businessDetailsReset(e, fieldName, index)}
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
            <AppNavigation action={this.submit} />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
