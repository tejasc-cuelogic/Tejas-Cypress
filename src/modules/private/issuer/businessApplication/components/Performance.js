import React, { Component } from 'react';
import { Grid, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MaskedInput2, FileUploader } from '../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';

@inject('newBusinessStore')
@observer
export default class Performance extends Component {
  submit = () => {
    // e.preventDefault();
    console.log(111);
    // this.props.history.push(`/app/business-application/${APP_STATUS}`);
  }
  render() {
    const {
      BUSINESS_PERF_FRM, businessPerfChange, performanceFiles, performanceReset,
    } = this.props.newBusinessStore;
    const { fields } = BUSINESS_PERF_FRM;
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
                {
                  ['prior3YrStatement', 'ytdStatements', 'fiveYrProjections'].map(field => (
                    <Grid.Column>
                      <FileUploader
                        key={field}
                        name={field}
                        fielddata={fields[field]}
                        uploadDocument={performanceFiles}
                        removeUploadedDocument={performanceReset}
                      />
                    </Grid.Column>
                  ))
                }
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
                          changed={businessPerfChange}
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
                          changed={businessPerfChange}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <AppNavigation action={this.submit} />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
