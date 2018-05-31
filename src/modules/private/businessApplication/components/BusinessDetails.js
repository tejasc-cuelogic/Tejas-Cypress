import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Divider, Form, Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput } from '../../../../theme/form/FormElements';
import FormElementWrap from '../../../public/businessSignup/components/FormElementWrap';

@inject('newBusinessStore')
@observer
export default class BusinessDetails extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange,
    } = this.props.newBusinessStore;
    const { fields } = BUSINESS_APP_FRM;
    return (
      <Grid container>
        <Grid.Column>
          <Form className="issuer-signup">
            <Header as="h1">
              Business Details
              <Header.Subheader>
                Quickly, safely and accurately submit your business information.
              </Header.Subheader>
            </Header>
            <Divider section className="doubled" />
            <FormElementWrap
              header={
                <span>
                  Business Plan
                  <Link to="/" className="link"><small>Learn More</small></Link>
                </span>
              }
              subHeader="What are the outstanding debt obligations for the business?"
            >
              {/* Temp Code */}
              <Header as="h3" color="brown">[ Placeholder for File Uploader UI ]</Header>
              {/* Temp Code */}
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
                      changed={businessAppEleChange}
                    />
                    <Button size="tiny" color="violet" className="ghost-button additional-field" content="+ Add additional debt" />
                    <FormInput
                      name="remainingPrincipal"
                      value={fields.remainingPrincipal.value}
                      fielddata={fields.remainingPrincipal}
                      changed={businessAppEleChange}
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
                          changed={businessAppEleChange}
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
                            changed={businessAppEleChange}
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
                            changed={businessAppEleChange}
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
                            changed={businessAppEleChange}
                          />
                        ))
                      }
                    </Form.Group>
                    {/* Temp Code */}
                    <Header as="h3" color="brown">[ Placeholder for File Uploader UI ]</Header>
                    {/* Temp Code */}
                  </div>
                </Grid.Column>
              </Grid>
              <Divider hidden />
              <Button inverted color="green">+ Add other owners</Button>
            </FormElementWrap>
            <div className="navigation-buttons">
              <Button circular icon className="multistep__btn prev">
                <Icon className="ns-arrow-left" />
              </Button>
              <Button circular icon primary className="multistep__btn next active">
                <Icon className="ns-arrow-right" />
              </Button>
            </div>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
