import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { get } from 'lodash';
import { DropZoneConfirm as DropZone } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

@inject('businessAppStore', 'userStore')
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
    } = this.props.businessAppStore;
    const { hideFields } = this.props;
    const userAccess = this.props.userStore.myAccessForModule('APPLICATIONS');
    const { fields } = BUSINESS_DOC_FRM;
    return (
      <Aux>
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
                disabled={formReadOnlyMode}
                multiple
                name="dueDiligence"
                fielddata={fields.dueDiligence}
                ondrop={(files, fieldName) =>
                  businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM')}
                onremove={(fieldName, index) =>
                  businessAppRemoveFiles(fieldName, 'BUSINESS_DOC_FRM', index)}
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
                disabled={formReadOnlyMode}
                multiple
                name="legalDocs"
                fielddata={fields.legalDocs}
                ondrop={(files, fieldName) =>
                  businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM')}
                onremove={(fieldName, index) =>
                  businessAppRemoveFiles(fieldName, 'BUSINESS_DOC_FRM', index)}
              />
            </Grid.Column>
          </Grid>
        </FormElementWrap>
      </Aux>
    );
  }
}
