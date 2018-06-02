import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Divider, Form, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, FileUploader2 } from '../../../../theme/form/FormElements';
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
      BUSINESS_DETAILS_FRM, businessDetailsChange, issuerFiles,
    } = this.props.newBusinessStore;
    const { fields } = BUSINESS_DETAILS_FRM;
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
              <FileUploader2
                name="businessPlan"
                fielddata={fields.businessPlan}
                uploadDocument={issuerFiles}
              />
            </FormElementWrap>
            <FormElementWrap
              header="Existing Debt"
              subHeader="What are the outstanding debt obligations for the business?"
            >
              <Grid>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    <FormInput
                      name="existingDebt1"
                      value={fields.existingDebt1.value}
                      fielddata={fields.existingDebt1}
                      changed={businessDetailsChange}
                    />
                    <Button size="tiny" color="violet" className="ghost-button additional-field" content="+ Add additional debt" />
                    <FormInput
                      name="remainingPrincipal"
                      value={fields.remainingPrincipal.value}
                      fielddata={fields.remainingPrincipal}
                      changed={businessDetailsChange}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['interestExpenses', 'termMonths'].map(field => (
                        <FormInput
                          key={field}
                          type="text"
                          name={field}
                          fielddata={fields[field]}
                          changed={businessDetailsChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap
              header="Owners"
              subHeader="Please list all individuals with at least 20% ownership."
            >
              <Grid>
                <Grid.Column widescreen={14} largeScreen={14} computer={14} tablet={16} mobile={16}>
                  <Header as="h3">Owner 1</Header>
                  <div className="field-wrap">
                    <Form.Group widths="equal">
                      {
                        ['fullLegalName', 'yearsExperience'].map(field => (
                          <FormInput
                            key={field}
                            type="text"
                            name={field}
                            fielddata={fields[field]}
                            changed={businessDetailsChange}
                          />
                        ))
                      }
                    </Form.Group>
                    <Form.Group widths="equal">
                      {
                        ['ssnNumber', 'ownershipOfCompany'].map(field => (
                          <FormInput
                            key={field}
                            type="text"
                            name={field}
                            fielddata={fields[field]}
                            changed={businessDetailsChange}
                          />
                        ))
                      }
                    </Form.Group>
                    <Form.Group widths="equal">
                      {
                        ['linkedInURL', 'title'].map(field => (
                          <FormInput
                            key={field}
                            type="text"
                            name={field}
                            fielddata={fields[field]}
                            changed={businessDetailsChange}
                          />
                        ))
                      }
                    </Form.Group>
                    <FileUploader2
                      name="ownerResume"
                      fielddata={fields.ownerResume}
                      uploadDocument={issuerFiles}
                    />
                  </div>
                </Grid.Column>
              </Grid>
              <Divider hidden />
              <Button inverted color="green">+ Add other owners</Button>
            </FormElementWrap>
            <AppNavigation action={this.submit} />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
