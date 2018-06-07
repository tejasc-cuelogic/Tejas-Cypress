import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Popup, Icon, Grid, List, Message } from 'semantic-ui-react';
// import Dropzone from 'react-dropzone';

import validationActions from '../../../actions/validation';
import ListErrors from '../../../theme/common/ListErrors';
import FieldError from '../../../theme/common/FieldError';

@inject('profileStore', 'uiStore')
@withRouter
@observer
export default class ConfirmIdentityDocuments extends Component {
  handleCloseModal = () => {
    this.props.setDashboardWizardStep();
    this.props.profileStore.reset();
    this.props.uiStore.clearErrors();
  }
  uploadDocument = (e) => {
    if (e.target.files.length) {
      const uploadFile = e.target.files[0];
      this.props.profileStore.setConfirmIdentityDocuments(e.target.name, uploadFile.name);
    }
  }

  removeUploadedPhotoId = () => {
    this.props.profileStore.setConfirmIdentityDocuments('photoId', '');
  }

  removeUploadedProofOfResidence = () => {
    this.props.profileStore.setConfirmIdentityDocuments('proofOfResidence', '');
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateConfirmIdentityDocumentsForm();
    if (this.props.profileStore.canSubmitConfirmIdentityDocumentsForm) {
      this.props.profileStore.uploadAndUpdateCIPInfo().then(() => {
        this.props.profileStore.startPhoneVerification().then(() => {
          this.props.setDashboardWizardStep('ConfirmPhoneNumber');
        });
      })
        .catch(() => { });
    }
  }

  render() {
    const { confirmIdentityDocuments } = this.props.profileStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.handleCloseModal()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">We need to confirm your identity</Header>
          <Divider />
          <p>
            Please upload two valid identity documents
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error textAlign="left">
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Form onSubmit={this.handleSubmitForm} className="file-uploader-inline">
            <Grid divided="vertically">
              <Grid.Row>
                <Grid.Column width={7}>
                  {/* eslint-disable jsx-a11y/label-has-for */}
                  <Header>
                    Upload a Photo ID
                    <Header.Subheader>Driving Liscence or passport</Header.Subheader>
                  </Header>
                </Grid.Column>
                <Grid.Column width={9}>
                  {confirmIdentityDocuments.fields.photoId.value === '' &&
                  // <div>
                    <div className="file-uploader">
                      <Icon className="ns-upload" /> Choose a file <span>or drag it here</span>
                      <input
                        name={confirmIdentityDocuments.fields.photoId.key}
                        type="file"
                        onChange={this.uploadDocument}
                        accept=".jpg,.jpeg,.pdf"
                        error={!!confirmIdentityDocuments.fields.photoId.error}
                      />
                    </div>
                  //   <div>
                  //     <Dropzone>
                  //       {({
                  //         isDragActive, isDragReject, acceptedFiles, rejectedFiles,
                  //       }) => {
                  //         if (isDragActive) {
                  //           return 'This file is authorized';
                  //         }
                  //         if (isDragReject) {
                  //           return 'This file is not authorized';
                  //         }
                  //         return acceptedFiles.length || rejectedFiles.length
                  //           ? console.log(acceptedFiles)
                  //           : 'Try dropping some files.';
                  //       }}
                  //     </Dropzone>
                  //   </div>
                  // </div>
                  }
                  <FieldError error={confirmIdentityDocuments.fields.photoId.error} />
                  {confirmIdentityDocuments.fields.photoId.value !== '' &&
                  <div className="file-uploader attached">
                    <span title={confirmIdentityDocuments.fields.photoId.value}>
                      {confirmIdentityDocuments.fields.photoId.value}
                    </span>
                    <Icon className="ns-close" size="small" onClick={this.removeUploadedPhotoId} />
                  </div>
                  }
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={7}>
                  <label>
                    <h3>Proof of Residence
                      <Popup className="test" trigger={<Icon className="ns-help-circle" />} position="top center" flowing hoverable>
                        <Popup.Content>
                          <p><b>Acceptable documents:</b></p>
                          <List bulleted>
                            <List.Item>Utility bill in your name for that address</List.Item>
                            <List.Item>
                              Signed lease (if an apartment) that shows the<br />
                              address (just the signature page)
                            </List.Item>
                            <List.Item>Voided check with your name  and address on it</List.Item>
                            <List.Item>A completed USPS mail forward form</List.Item>
                            <List.Item>DMV registration form</List.Item>
                          </List>
                        </Popup.Content>
                      </Popup>
                    </h3>
                    Utility Bill or USPS change of address format
                  </label>
                </Grid.Column>
                <Grid.Column width={9}>
                  {confirmIdentityDocuments.fields.proofOfResidence.value === '' &&
                    <div className="file-uploader">
                      <Icon className="ns-upload" /> Choose a file <span>or drag it here</span>
                      <input
                        name={confirmIdentityDocuments.fields.proofOfResidence.key}
                        type="file"
                        onChange={this.uploadDocument}
                        accept=".jpg,.jpeg,.pdf"
                        error={!!confirmIdentityDocuments.fields.proofOfResidence.error}
                      />
                    </div>
                  }
                  <FieldError error={confirmIdentityDocuments.fields.proofOfResidence.error} />
                  {confirmIdentityDocuments.fields.proofOfResidence.value !== '' &&
                    <div className="file-uploader attached">
                      <span title={confirmIdentityDocuments.fields.proofOfResidence.value}>
                        {confirmIdentityDocuments.fields.proofOfResidence.value}
                      </span>
                      <Icon className="ns-close" size="small" onClick={this.removeUploadedProofOfResidence} />
                    </div>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider section hidden />
            <div className="center-align">
              <Button loading={this.props.uiStore.inProgress} primary size="large" className="very relaxed" disabled={!confirmIdentityDocuments.meta.isValid}>Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button type="button" className="cancel-link" onClick={() => this.handleCloseModal()}>I`ll finish this letter</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
