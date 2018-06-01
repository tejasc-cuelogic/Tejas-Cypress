import React, { Component } from 'react';
import { Grid, Header, Form, Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MaskedInput2 } from '../../../../theme/form/FormElements';
import FormElementWrap from '../../../public/businessSignup/components/FormElementWrap';

@inject('newBusinessStore')
@observer
export default class Performance extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange,
    } = this.props.newBusinessStore;
    const { fields } = BUSINESS_APP_FRM;
    return (
      <Grid container>
        <Grid.Column>
          <Form className="issuer-signup">
            <FormElementWrap
              as="h1"
              header="Performance"
              subHeader="Quickly, safely and accurately submit your business information."
            />
            <FormElementWrap
              header="Financial Statements"
              subHeader="How has the business been performing, and what are your projections? Upload your financial statements in each section."
            >
              <Grid stackable columns="equal">
                <Grid.Column>
                  {/* Temp Code */}
                  <Header as="h3" color="brown">[ Placeholder for File Uploader UI ]</Header>
                  {/* Temp Code */}
                </Grid.Column>
                <Grid.Column>
                  {/* Temp Code */}
                  <Header as="h3" color="brown">[ Placeholder for File Uploader UI ]</Header>
                  {/* Temp Code */}
                </Grid.Column>
                <Grid.Column>
                  {/* Temp Code */}
                  <Header as="h3" color="brown">[ Placeholder for File Uploader UI ]</Header>
                  {/* Temp Code */}
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap
              header="Performance"
              subHeader="This information was captured from the Pre-Qualification form. You can update any numbers below if needed."
            >
              <Grid>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['pyGrossSales', 'pyOperatingExpenses', 'pyNetIncome', 'pyCogs'].map(field => (
                        <MaskedInput2
                          key={field}
                          name={field}
                          currency
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    {
                      ['fyGrossSales', 'fyOperatingExpenses', 'fyNetIncome', 'fyCogs'].map(field => (
                        <MaskedInput2
                          key={field}
                          name={field}
                          currency
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessAppEleChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <div className="navigation-buttons">
              <div className="pull-left">
                <Button circular icon className="multistep__btn prev">
                  <Icon className="ns-arrow-left" />
                </Button>
                Business Details
              </div>
              <div className="pull-right">
                Documentation
                <Button circular icon primary className="multistep__btn next active">
                  <Icon className="ns-arrow-right" />
                </Button>
              </div>
            </div>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
