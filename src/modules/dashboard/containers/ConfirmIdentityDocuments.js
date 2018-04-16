import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Popup, Icon, Grid, List } from 'semantic-ui-react';

@inject('profileStore')
@observer
export default class ConfirmIdentityDocuments extends Component {
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
    this.props.setDashboardWizardStep('ConfirmPhoneNumber');
  }
  render() {
    const { confirmIdentityDocuments } = this.props.profileStore;
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">We need to confirm your identity</Header>
          <Divider />
          <p>
            Please upload two valid identity documents or<br />
            <Link to="/app/dashboard" onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}>update your SSN number</Link>
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form onSubmit={this.handleSubmitForm} className="file-uploader-inline">
            <Grid divided="vertically">
              <Grid.Row>
                <Grid.Column width={7}>
                  {/* eslint-disable jsx-a11y/label-has-for */}
                  <label>
                    <h3>Upload a Photo ID</h3>
                    Driving Liscence or passport
                  </label>
                </Grid.Column>
                <Grid.Column width={9}>
                  {confirmIdentityDocuments.photoId.nameOfUploadedFile === '' &&
                    <div className="file-uploader">
                      <Icon name="upload" /> Choose a file <span>or drag it here</span>
                      <input
                        name={confirmIdentityDocuments.photoId.key}
                        type="file"
                        onChange={this.uploadDocument}
                        accept=".jpg,.jpeg,.pdf"
                      />
                    </div>
                  }
                  {confirmIdentityDocuments.photoId.nameOfUploadedFile !== '' &&
                  <div className="file-uploader attached">
                    <span title={confirmIdentityDocuments.photoId.nameOfUploadedFile}>
                      {confirmIdentityDocuments.photoId.nameOfUploadedFile}
                    </span>
                    <Icon name="remove" onClick={this.removeUploadedPhotoId} />
                  </div>
                  }
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={7}>
                  <label>
                    <h3>Proof of Residence
                      <Popup className="test" trigger={<Icon name="help circle outline" />} position="top center" flowing hoverable>
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
                  {confirmIdentityDocuments.proofOfResidence.nameOfUploadedFile === '' &&
                    <div className="file-uploader">
                      <Icon name="upload" /> Choose a file <span>or drag it here</span>
                      <input
                        name={confirmIdentityDocuments.proofOfResidence.key}
                        type="file"
                        onChange={this.uploadDocument}
                        accept=".jpg,.jpeg,.pdf"
                      />
                    </div>
                  }
                  {confirmIdentityDocuments.proofOfResidence.nameOfUploadedFile !== '' &&
                    <div className="file-uploader attached">
                      <span title={confirmIdentityDocuments.proofOfResidence.nameOfUploadedFile}>
                        {confirmIdentityDocuments.proofOfResidence.nameOfUploadedFile}
                      </span>
                      <Icon name="remove" onClick={this.removeUploadedProofOfResidence} />
                    </div>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider section hidden />
            <div className="center-align">
              <Button color="green" size="large" className="very relaxed">Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>I`ll finish this letter</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
