import React, { Component } from 'react';
import { Header, Form, Grid, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('accountStore')
@observer
export default class FormationDocumemts extends Component {
  uploadDocument = (e) => {
    if (e.target.files.length) {
      const uploadFile = e.target.files[0];
      this.props.accountStore.setEntityAccountDetails(e.target.name, uploadFile.name);
    }
  }

  removeEntityFormationDocument = () => {
    this.props.accountStore.setEntityAccountDetails('entityFormationDocument', '');
  }

  removeEntityOperatingDocument = () => {
    this.props.accountStore.setEntityAccountDetails('entityOperatingDocument', '');
  }

  removeEinVerification = () => {
    this.props.accountStore.setEntityAccountDetails('einVerification', '');
  }

  render() {
    const { entityAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h2">Upload required documentation</Header>
        <Form className="file-uploader-inline">
          <Grid divided="vertically">
            <Grid.Row>
              <Grid.Column width={7}>
                {/* eslint-disable jsx-a11y/label-has-for */}
                <label>
                  <h3>{entityAccount.entityFormationDocument.label}</h3>
                </label>
              </Grid.Column>
              <Grid.Column width={9}>
                {entityAccount.entityFormationDocument.value === '' &&
                  <div className="file-uploader">
                    <Icon name="upload" /> Choose a file <span>or drag it here</span>
                    <input
                      name={entityAccount.entityFormationDocument.key}
                      type="file"
                      onChange={this.uploadDocument}
                    />
                  </div>
                }
                {entityAccount.entityFormationDocument.value !== '' &&
                <div className="file-uploader attached">
                    {entityAccount.entityFormationDocument.value}
                  <Icon name="remove" onClick={this.removeEntityFormationDocument} />
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
                    <Icon name="upload" /> Choose a file <span>or drag it here</span>
                    <input
                      name={entityAccount.entityOperatingDocument.key}
                      type="file"
                      onChange={this.uploadDocument}
                    />
                  </div>
                }
                {entityAccount.entityOperatingDocument.value !== '' &&
                  <div className="file-uploader attached">
                    {entityAccount.entityOperatingDocument.value}
                    <Icon name="remove" onClick={this.removeEntityOperatingDocument} />
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
                    <Icon name="upload" /> Choose a file <span>or drag it here</span>
                    <input
                      name={entityAccount.einVerification.key}
                      type="file"
                      onChange={this.uploadDocument}
                    />
                  </div>
                }
                {entityAccount.einVerification.value !== '' &&
                  <div className="file-uploader attached">
                    {entityAccount.einVerification.value}
                    <Icon name="remove" onClick={this.removeEinVerification} />
                  </div>
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </div>
    );
  }
}
