import React, { Component } from 'react';
import { Header, Form, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FileUploaderVertical } from '../../../../components/form/FormElements';

@inject('entityAccountStore')
@observer
export default class FormationDocumemts extends Component {
  render() {
    const { formFormationDocuments, formationDocFileUpload, formationDocResetField } =
    this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Upload required documentation</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Header>
        <Form className="file-uploader-inline">
          <Grid divided="vertically">
            <FileUploaderVertical
              fielddata={formFormationDocuments.fields.entityFormationDocument}
              uploadDocument={formationDocFileUpload}
              removeUploadedDocument={formationDocResetField}
            />
            <FileUploaderVertical
              fielddata={formFormationDocuments.fields.entityOperatingDocument}
              uploadDocument={formationDocFileUpload}
              removeUploadedDocument={formationDocResetField}
            />
            <FileUploaderVertical
              fielddata={formFormationDocuments.fields.einVerification}
              uploadDocument={formationDocFileUpload}
              removeUploadedDocument={formationDocResetField}
            />
          </Grid>
        </Form>
      </div>
    );
  }
}
