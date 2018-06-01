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
          <Grid verticalAlign="middle" divided="vertically">
            <Grid.Row>
              <Grid.Column width={7}>
                <Header as="h3">Entity Formation Document</Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <FileUploader
                  key="formationDoc"
                  name="formationDoc"
                  fielddata={formFormationDocuments.fields.formationDoc}
                  uploadDocument={formationDocFileUpload}
                  removeUploadedDocument={formationDocResetField}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={7}>
                <Header as="h3">Entity Operating Document</Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <FileUploader
                  key="operatingAgreementDoc"
                  name="operatingAgreementDoc"
                  fielddata={formFormationDocuments.fields.operatingAgreementDoc}
                  uploadDocument={formationDocFileUpload}
                  removeUploadedDocument={formationDocResetField}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={7}>
                <Header as="h3">EIN Verification</Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <FileUploader
                  key="einVerificationDoc"
                  name="einVerificationDoc"
                  fielddata={formFormationDocuments.fields.einVerificationDoc}
                  uploadDocument={formationDocFileUpload}
                  removeUploadedDocument={formationDocResetField}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </div>
    );
  }
}
