import React, { Component } from 'react';
import { Grid, Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MaskedInput2, DropZone } from '../../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';

@inject('businessAppStore')
@observer
export default class Performance extends Component {
  componentWillMount() {
    this.props.businessAppStore.setFieldvalue('applicationStep', 'performance');
  }
  submit = () => {
    // e.preventDefault();
    console.log(111);
    // this.props.history.push(`/app/business-application/${APP_STATUS}`);
  }

  render() {
    const {
      BUSINESS_PERF_FRM,
      businessPerfMaskingChange, getBusinessTypeCondtion,
      businessAppUploadFiles, businessAppRemoveFiles,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_PERF_FRM;
    const statmentConst = getBusinessTypeCondtion ? ['priorToThreeYear', 'ytd', 'fiveYearProjection'] : ['fiveYearProjection'];
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
                  statmentConst.map(field => (
                    <Grid.Column>
                      <DropZone
                        multiple
                        key={field}
                        name={field}
                        fielddata={fields[field]}
                        ondrop={(files, fieldName) =>
                          businessAppUploadFiles(files, fieldName, 'BUSINESS_PERF_FRM')}
                        onremove={(e, fieldName, index) =>
                          businessAppRemoveFiles(e, fieldName, 'BUSINESS_PERF_FRM', index)}
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
                {getBusinessTypeCondtion &&
                  <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                    <Header as="h5" content="Prior Year" />
                    <div className="field-wrap">
                      {
                        ['pyGrossSales', 'pyOperatingExpenses', 'pyNetIncome', 'pyCogs'].map(field => (
                          <MaskedInput2
                            key={field}
                            name={field}
                            currency
                            value={fields[field].value}
                            fielddata={fields[field]}
                            changed={businessPerfMaskingChange}
                          />
                        ))
                      }
                    </div>
                  </Grid.Column>
                }
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <Header as="h5" content="Future Year" />
                  <div className="field-wrap">
                    {
                      ['nyGrossSales', 'nyOperatingExpenses', 'nyNetIncome', 'nyCogs'].map(field => (
                        <MaskedInput2
                          key={field}
                          name={field}
                          currency
                          value={fields[field].value}
                          fielddata={fields[field]}
                          changed={businessPerfMaskingChange}
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
