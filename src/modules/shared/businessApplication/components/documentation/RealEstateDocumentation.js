import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { DropZoneConfirm as DropZone } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

@inject('businessAppStore')
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
    const { fields } = BUSINESS_DOC_FRM;
    return (
      <Aux>
        <FormElementWrap
          hideFields={hideFields}
          header="Upload Your Due Dilligence Documents"
          subHeader="Title commitment, survey, environmental reports, previous inspections, previous appraisals, etc"
        >
          <Grid stackable columns="equal">
            <Grid.Column>
              <DropZone
                hideFields={hideFields}
                disabled={formReadOnlyMode}
                multiple
                name="dueDiligence"
                fielddata={fields.dueDiligence}
                ondrop={(files, fieldName) =>
                  businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM')}
                onremove={(e, fieldName, index) =>
                  businessAppRemoveFiles(e, fieldName, 'BUSINESS_DOC_FRM', index)}
              />
            </Grid.Column>
          </Grid>
        </FormElementWrap>
        <FormElementWrap
          hideFields={hideFields}
          noDivider={hideFields || formReadOnlyMode}
          header="Upload Your Legal Documents"
          subHeader="For all related entities - filing docs, governing docs"
        >
          <Grid stackable columns="equal">
            <Grid.Column>
              <DropZone
                hideFields={hideFields}
                disabled={formReadOnlyMode}
                multiple
                name="legalDocs"
                fielddata={fields.legalDocs}
                ondrop={(files, fieldName) =>
                  businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM')}
                onremove={(e, fieldName, index) =>
                  businessAppRemoveFiles(e, fieldName, 'BUSINESS_DOC_FRM', index)}
              />
            </Grid.Column>
          </Grid>
        </FormElementWrap>
      </Aux>
    );
  }
}
