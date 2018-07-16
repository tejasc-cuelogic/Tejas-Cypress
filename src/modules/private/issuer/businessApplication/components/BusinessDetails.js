import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Divider, Form, Button, Icon } from 'semantic-ui-react';
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
                    <Grid.Column
                      widescreen={7}
                      largeScreen={7}
                      computer={8}
                      tablet={16}
                      mobile={16}
                    >
                      <Header as="h3">Debt {index + 1}</Header>
                      <div className="field-wrap">
                        {
                          ['amount', 'remainingPrincipal'].map(field => (
                            <MaskedInput2
                              key={field}
                              currency
                              type="text"
                              name={field}
                              fielddata={debt[field]}
                              changed={values => businessDetailsMaskingChange(field, values, 'debts', index)}
                            />
                            // <FormInput
                            //   key={field}
                            //   type="text"
                            //   name={field}
                            //   fielddata={debt[field]}
                            //   changed={(e, res) => businessDetailsChange(e, res, 'debts', index)}
                            // />
                          ))
                        }
                      </div>
                    </Grid.Column>
                    <Grid.Column
                      widescreen={7}
                      largeScreen={7}
                      computer={8}
                      tablet={16}
                      mobile={16}
                    >
                      <Header as="h3">
                        {BUSINESS_DETAILS_FRM.fields.debts.length > 1 &&
                          <Button icon className="link-button pull-right" onClick={e => removeForm(e, 'debts', index)}>
                            <Icon color="red" size="small" className="ns-trash" />
                          </Button>
                        }
                      </Header>
                      <div className="field-wrap">
                        <MaskedInput2
                          percentage
                          type="text"
                          name="interestExpenses"
                          fielddata={debt.interestExpenses}
                          changed={values => businessDetailsMaskingChange('interestExpenses', values, 'debts', index)}
                        />
                        <MaskedInput2
                          number
                          type="text"
                          name="term"
                          fielddata={debt.term}
                          changed={values => businessDetailsMaskingChange('term', values, 'debts', index)}
                        />
                      </div>
                    </Grid.Column>
                  </Grid>
                ))
              }
              <Button size="tiny" onClick={e => addMoreForms(e, 'debts')} color="violet" className="ghost-button additional-field" content="+ Add additional debt" />
            </FormElementWrap>
            <FormElementWrap
              header="Owners"
              subHeader="Please list all individuals with at least 20% ownership."
            >
              {BUSINESS_DETAILS_FRM.fields.owners.length &&
                BUSINESS_DETAILS_FRM.fields.owners.map((owner, index) => (
                  <Grid>
                    <Grid.Column
                      widescreen={14}
                      largeScreen={14}
                      computer={14}
                      tablet={16}
                      mobile={16}
                    >
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
