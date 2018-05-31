import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Divider, Form, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput } from '../../../../theme/form/FormElements';

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
            <Header as="h2">
              Business Plan <Link to="/" className="link"><small>Learn More</small></Link>
            </Header>
            {/* Temp Code */}
            <Header as="h3" color="brown">[ Placeholder for File Uploader UI ]</Header>
            {/* Temp Code */}
            <Divider section className="doubled" />
            <Header as="h2">
              Existing Debt
              <Header.Subheader>
                What are the outstanding debt obligations for the business?
              </Header.Subheader>
            </Header>
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
            <Divider section className="doubled" />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
