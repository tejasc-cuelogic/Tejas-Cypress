import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Divider, Form, Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, DropZone } from '../../../../../theme/form';
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
                // fielddata={BUSINESS_DETAILS_FRM.fields.businessPlan[0].planDoc}
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
                            <FormInput
                              key={field}
                              type="text"
                              name={field}
                              fielddata={debt[field]}
                              changed={businessDetailsChange}
                            />
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
                        {
                          ['interestExpenses', 'term'].map(field => (
                            <FormInput
                              key={field}
                              type="text"
                              name={field}
                              fielddata={debt[field]}
                              changed={businessDetailsChange}
                            />
                          ))
                        }
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
                          {
                            ['fullLegalName', 'yearsOfExp'].map(field => (
                              <FormInput
                                key={field}
                                type="text"
                                name={field}
                                fielddata={owner[field]}
                                changed={businessDetailsChange}
                              />
                            ))
                          }
                        </Form.Group>
                        <Form.Group widths="equal">
                          {
                            ['ssn', 'companyOwnerShip'].map(field => (
                              <FormInput
                                key={field}
                                type="text"
                                name={field}
                                fielddata={owner[field]}
                                changed={businessDetailsChange}
                              />
                            ))
                          }
                        </Form.Group>
                        <Form.Group widths="equal">
                          {
                            ['linkedInUrl', 'title'].map(field => (
                              <FormInput
                                key={field}
                                type="text"
                                name={field}
                                fielddata={owner[field]}
                                changed={businessDetailsChange}
                              />
                            ))
                          }
                        </Form.Group>
                        <DropZone
                          name="resume"
                          fielddata={owner.resume}
                          ondrop={businessDetailsFiles}
                          onremove={businessDetailsReset}
                        />
                      </div>
                    </Grid.Column>
                  </Grid>
                ))
              }
              <Divider hidden />
              {BUSINESS_DETAILS_FRM.fields.owners.length !== 5 &&
                <Button onClick={e => addMoreForms(e, 'owners')} inverted color="green">+ Add other owners</Button>
              }
            </FormElementWrap>
            <AppNavigation action={this.submit} />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
