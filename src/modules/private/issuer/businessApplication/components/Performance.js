import React, { Component } from 'react';
import { Grid, Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MaskedInput, DropZoneConfirm as DropZone } from '../../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';

@inject('businessAppStore')
@observer
export default class Performance extends Component {
  componentWillMount() {
    this.props.businessAppStore.setFieldvalue('applicationStep', 'performance');
  }

  render() {
    const {
      BUSINESS_PERF_FRM, formReadOnlyMode, currentApplicationType,
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
              header={`${currentApplicationType === 'business' ? 'Financial Statements' : 'Upload your Financial Model'}`}
              subHeader={`${currentApplicationType === 'business' ? 'How has the business been performing, and what are your projections? Upload your financial statements in each section.' : 'Working model including all assumptions, project cashflows and distributions (5-10yr projections). Include stress testing'}`}
            >
              <Grid stackable columns="equal">
                {
                  statmentConst.map(field => (
                    <Grid.Column key={field}>
                      <DropZone
                        disabled={formReadOnlyMode}
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
            {currentApplicationType === 'business' &&
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
                        ['pyGrossSales', 'pyCogs', 'pyOperatingExpenses', 'pyNetIncome'].map(field => (
                          <MaskedInput
                            disabled={formReadOnlyMode}
                            key={field}
                            name={field}
                            prefix="$ "
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
                      ['nyGrossSales', 'nyCogs', 'nyOperatingExpenses', 'nyNetIncome'].map(field => (
                        <MaskedInput
                          disabled={formReadOnlyMode}
                          key={field}
                          name={field}
                          prefix="$ "
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
            }
            <AppNavigation />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
