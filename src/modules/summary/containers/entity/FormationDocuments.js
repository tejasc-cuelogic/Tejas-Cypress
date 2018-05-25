import React, { Component } from 'react';
import { Header, Form, Grid, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FileUploader } from '../../../../theme/form/FormElements';

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
        <Divider hidden />
        <Form className="file-uploader-inline">
          <Grid divided="vertically">
            {
              ['entityFormationDocument', 'entityOperatingDocument', 'einVerification'].map(field => (
                <FileUploader
                  name={field}
                  fielddata={formFormationDocuments.fields[field]}
                  uploadDocument={formationDocFileUpload}
                  removeUploadedDocument={formationDocResetField}
                />
              ))
            }
          </Grid>
        </Form>
      </div>
    );
  }
}
