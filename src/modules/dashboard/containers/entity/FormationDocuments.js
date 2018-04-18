import React, { Component } from 'react';
import { Header, Form, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import FilerUploaderVertical from '../../../../components/form/FileUploaderVertical';

@inject('entityAccountStore')
@observer
export default class FormationDocumemts extends Component {
  render() {
    const { formFormationDocuments, onFileUpload, resetFieldValue } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Upload required documentation</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Header>
        <Form className="file-uploader-inline">
          <Grid divided="vertically">
            <FilerUploaderVertical
              label={formFormationDocuments.fields.entityFormationDocument.label}
              name={formFormationDocuments.fields.entityFormationDocument.key}
              value={formFormationDocuments.fields.entityFormationDocument.value}
              uploadDocument={onFileUpload}
              removeUploadedDocument={resetFieldValue}
            />
            <FilerUploaderVertical
              label={formFormationDocuments.fields.entityOperatingDocument.label}
              name={formFormationDocuments.fields.entityOperatingDocument.key}
              value={formFormationDocuments.fields.entityOperatingDocument.value}
              uploadDocument={onFileUpload}
              removeUploadedDocument={resetFieldValue}
            />
            <FilerUploaderVertical
              label={formFormationDocuments.fields.einVerification.label}
              name={formFormationDocuments.fields.einVerification.key}
              value={formFormationDocuments.fields.einVerification.value}
              uploadDocument={onFileUpload}
              removeUploadedDocument={resetFieldValue}
            />
          </Grid>
        </Form>
      </div>
    );
  }
}
