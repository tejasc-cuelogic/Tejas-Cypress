/* eslint-disable max-len */
import React, { Component } from 'react';
import { Grid, Form, Header, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MaskedInput, DropZoneConfirm as DropZone } from '../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';

@inject('businessAppStore', 'commonStore', 'userStore', 'uiStore')
@observer
export default class Performance extends Component {
  componentWillMount() {
    this.props.businessAppStore.setFieldvalue('applicationStep', 'performance');
  }

  render() {
    const {
      BUSINESS_PERF_FRM, formReadOnlyMode, currentApplicationType,
      businessPerfMaskingChange, getBusinessTypeCondtion, getOwnPropertyCondtion,
      businessAppUploadFiles, businessAppRemoveFiles,
      businessAppParitalSubmit, enableSave, businessApplicationDetailsAdmin,
    } = this.props.businessAppStore;
    const { hideFields } = this.props;
    const { fields } = BUSINESS_PERF_FRM;
    let disableFileUpload = true;
    const { inProgress } = this.props.uiStore;
    if (this.props.userStore.isAdmin && this.props.userStore.isApplicationManager) {
      disableFileUpload = false;
    }
    const statmentConst = getBusinessTypeCondtion || getOwnPropertyCondtion ? ['priorToThreeYear', 'ytd', 'fiveYearProjection'] : ['fiveYearProjection'];
    return (
      <div className={hideFields ? 'inner-content-spacer' : 'ui container'}>
        <Form className="issuer-signup">
          {!hideFields
            && (
<FormElementWrap
  as="h1"
  header="Performance"
  subHeader="Quickly, safely and accurately submit your business information."
/>
            )
          }
          <FormElementWrap
            hideFields={hideFields}
            noDivider={hideFields || formReadOnlyMode}
            header={`${currentApplicationType === 'business' ? 'Financial Statements' : 'Upload your Financial Model'}`}
            subHeader={`${currentApplicationType === 'business' ? 'How has the business been performing, and what are your projections? Upload your financial statements in each section.' : 'Working model including all assumptions, project cashflows and distributions (5-10yr projections). Include stress testing'}`}
          >
            <Grid stackable columns="equal">
              {
                statmentConst.map(field => (
                  <Grid.Column key={field}>
                    <DropZone
                      sharableLink
                      hideFields={hideFields}
                      disabled={formReadOnlyMode && disableFileUpload}
                      multiple
                      key={field}
                      name={field}
                      asterisk="true"
                      fielddata={fields[field]}
                      ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_PERF_FRM', null, this.props.userStore.isApplicationManager)}
                      onremove={(fieldName, index) => businessAppRemoveFiles(fieldName, 'BUSINESS_PERF_FRM', index)}
                    />
                  </Grid.Column>
                ))
              }
            </Grid>
          </FormElementWrap>
          <FormElementWrap
            hideFields={hideFields}
            noDivider={hideFields || formReadOnlyMode}
            header="Sources & Uses"
            subHeader={(
<span>
                Unless provided in your business plan or financial projections, please upload a table clearly outlining all sources of capital (to include the <br />
                proposed NextSeed amount) for your project in addition to the proposed uses of that capital.
              </span>
)}
          >
            <Grid stackable columns="equal">
              <Grid.Column key="sourcesAndUses">
                <DropZone
                  sharableLink
                  hideFields={hideFields}
                  disabled={formReadOnlyMode && disableFileUpload}
                  multiple
                  key="sourcesAndUses"
                  name="sourcesAndUses"
                  fielddata={fields.sourcesAndUses}
                  ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_PERF_FRM', null, this.props.userStore.isApplicationManager)}
                  onremove={(fieldName, index) => businessAppRemoveFiles(fieldName, 'BUSINESS_PERF_FRM', index)}
                />
              </Grid.Column>
            </Grid>
          </FormElementWrap>
          {currentApplicationType === 'business'
            && (
<FormElementWrap
  hideFields={hideFields}
  noDivider={hideFields || formReadOnlyMode}
  header="Performance"
  subHeader="This information was captured from the Pre-Qualification form. You can update any numbers below if needed."
>
              <Grid>
                {getBusinessTypeCondtion
                  && (
<Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                    <Header as={hideFields ? 'h6' : 'h5'} content="Prior Year" />
                    <div className="field-wrap">
                      {
                        ['pyGrossSales', 'pyOperatingExpenses', 'pyNetIncome', 'pyCogs'].map(field => (
                          <MaskedInput
                            readOnly={formReadOnlyMode}
                            containerclassname={formReadOnlyMode ? 'display-only' : ''}
                            key={field}
                            name={field}
                            prefix="$ "
                            currency
                            asterisk="true"
                            value={fields[field].value}
                            fielddata={fields[field]}
                            changed={businessPerfMaskingChange}
                          />
                        ))
                      }
                    </div>
                  </Grid.Column>
                  )
                }
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <Header as={hideFields ? 'h6' : 'h5'} content="Future Year" />
                  <div className="field-wrap">
                    {
                      ['nyGrossSales', 'nyOperatingExpenses', 'nyNetIncome', 'nyCogs'].map(field => (
                        <MaskedInput
                          readOnly={formReadOnlyMode}
                          containerclassname={formReadOnlyMode ? 'display-only' : ''}
                          key={field}
                          name={field}
                          prefix="$ "
                          currency
                          asterisk="true"
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
            )
          }
          <AppNavigation
            hideFields={hideFields}
            isFileUploading={this.props.businessAppStore.isFileUploading}
          />
          {this.props.userStore.isAdmin && this.props.userStore.isApplicationManager
            ? (
<div className="right aligned">
              <Button
                inverted
                type="button"
                onClick={() => businessAppParitalSubmit(true)}
                className="align-right right-align"
                color="green"
                content="Save"
                disabled={!(businessApplicationDetailsAdmin.applicationStage === 'COMPLETED' ? enableSave && BUSINESS_PERF_FRM.meta.isValid : enableSave)}
                loading={inProgress}
              />
            </div>
            )
            : ''}
        </Form>
      </div>
    );
  }
}
