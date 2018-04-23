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
            {/* <Grid.Row>
              <Grid.Column width={7}>
                {/* eslint-disable jsx-a11y/label-has-for * /}
                <label>
                  <h3>{entityAccount.entityFormationDocument.label}</h3>
                </label>
              </Grid.Column>
              <Grid.Column width={9}>
                {entityAccount.entityFormationDocument.value === '' &&
                  <div className="file-uploader">
                    <Icon name="ns-upload" /> Choose a file <span>or drag it here</span>
                    <input
                      name={entityAccount.entityFormationDocument.key}
                      type="file"
                      onChange={this.uploadDocument}
                      accept=".jpg,.jpeg,.pdf"
                    />
                  </div>
                }
                {entityAccount.entityFormationDocument.value !== '' &&
                <div className="file-uploader attached">
                    {entityAccount.entityFormationDocument.value}
                  <Icon name="ns-close" size="small" onClick={this.removeEntityFormationDocument} />
                </div>
                }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={7}>
                <label>
                  <h3>{entityAccount.entityOperatingDocument.label}
                  </h3>
                </label>
              </Grid.Column>
              <Grid.Column width={9}>
                {entityAccount.entityOperatingDocument.value === '' &&
                  <div className="file-uploader">
                    <Icon name="ns-upload" /> Choose a file <span>or drag it here</span>
                    <input
                      name={entityAccount.entityOperatingDocument.key}
                      type="file"
                      onChange={this.uploadDocument}
                      accept=".jpg,.jpeg,.pdf"
                    />
                  </div>
                }
                {entityAccount.entityOperatingDocument.value !== '' &&
                  <div className="file-uploader attached">
                    {entityAccount.entityOperatingDocument.value}
                    <Icon name="ns-close" size="small" onClick={this.removeEntityOperatingDocument} />
                  </div>
                }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={7}>
                <label>
                  <h3>{entityAccount.einVerification.label}
                  </h3>
                </label>
              </Grid.Column>
              <Grid.Column width={9}>
                {entityAccount.einVerification.value === '' &&
                  <div className="file-uploader">
                    <Icon name="ns-upload" /> Choose a file <span>or drag it here</span>
                    <input
                      name={entityAccount.einVerification.key}
                      type="file"
                      onChange={this.uploadDocument}
                      accept=".jpg,.jpeg,.pdf"
                    />
                  </div>
                }
                {entityAccount.einVerification.value !== '' &&
                  <div className="file-uploader attached">
                    {entityAccount.einVerification.value}
                    <Icon name="ns-close" size="small" onClick={this.removeEinVerification} />
                  </div>
                }
              </Grid.Column>
            </Grid.Row> */}
            {
              ['entityFormationDocument', 'entityOperatingDocument', 'einVerification'].map(field => (
                <FileUploaderVertical
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
