import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { DropZoneConfirm as DropZone } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

@inject('businessAppStore', 'userStore', 'uiStore')
@observer
export default class RealEstateDocumentation extends Component {
  componentWillMount() {
    this.props.businessAppStore.setFieldvalue('applicationStep', 'documentation');
  }

  render() {
    const {
      BUSINESS_DOC_FRM,
      businessAppUploadFiles,
      businessAppRemoveFiles,
      formReadOnlyMode,
      businessApplicationDetailsAdmin,
      enableSave,
      businessAppParitalSubmit,
    } = this.props.businessAppStore;
    const { hideFields } = this.props;
    const userAccess = this.props.userStore.myAccessForModule('APPLICATIONS');
    const { fields } = BUSINESS_DOC_FRM;
    const { inProgress } = this.props.uiStore;
    let disableFileUpload = true;
    if (this.props.userStore.isAdmin && this.props.userStore.isApplicationManager) {
      disableFileUpload = false;
    }
    return (
      <>
        <FormElementWrap
          hideFields={hideFields}
          header="Upload Your Due Dilligence Documents*"
          subHeader="Title commitment, survey, environmental reports, previous inspections, previous appraisals, etc"
        >
          <Grid stackable columns="equal">
            <Grid.Column>
              <DropZone
                sharableLink
                blockDownload={get(userAccess, 'asSupport')}
                hideFields={hideFields}
                disabled={formReadOnlyMode && disableFileUpload}
                multiple
                name="dueDiligence"
                fielddata={fields.dueDiligence}
                ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM', null, this.props.userStore.isApplicationManager)}
                onremove={(fieldName, index) => businessAppRemoveFiles(fieldName, 'BUSINESS_DOC_FRM', index)}
              />
            </Grid.Column>
          </Grid>
        </FormElementWrap>
        <FormElementWrap
          hideFields={hideFields}
          noDivider={hideFields || formReadOnlyMode}
          header="Upload Your Legal Documents*"
          subHeader="For all related entities - filing docs, governing docs"
        >
          <Grid stackable columns="equal">
            <Grid.Column>
              <DropZone
                sharableLink
                blockDownload={get(userAccess, 'asSupport')}
                hideFields={hideFields}
                disabled={formReadOnlyMode && disableFileUpload}
                multiple
                name="legalDocs"
                fielddata={fields.legalDocs}
                ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM', null, this.props.userStore.isApplicationManager)}
                onremove={(fieldName, index) => businessAppRemoveFiles(fieldName, 'BUSINESS_DOC_FRM', index)}
              />
            </Grid.Column>
          </Grid>
        </FormElementWrap>
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
              disabled={!(businessApplicationDetailsAdmin.applicationStage === 'COMPLETED' ? enableSave && BUSINESS_DOC_FRM.meta.isValid : enableSave)}
              loading={inProgress}
            />
          </div>
          )
          : ''}
      </>
    );
  }
}
