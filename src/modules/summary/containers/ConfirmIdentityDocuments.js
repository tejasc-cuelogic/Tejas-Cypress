import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Popup, Icon, Grid, List, Message, Confirm } from 'semantic-ui-react';

import validationActions from '../../../actions/validation';
import ListErrors from '../../../theme/common/ListErrors';
import { DropZone } from '../../../theme/form/FormElements';

@inject('profileStore', 'uiStore')
@withRouter
@observer
export default class ConfirmIdentityDocuments extends Component {
  onPhotoIdDrop = (files) => {
    this.props.profileStore.setFileUploadData('photoId', files);
  }

  onProofOfResidenceDrop = (files) => {
    this.props.profileStore.setFileUploadData('proofOfResidence', files);
  }

  handleDelDoc = (field) => {
    this.props.profileStore.removeUploadedData(field);
    this.props.uiStore.setConfirmBox('');
  }

  confirmRemoveDoc = (e, name) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name);
  }

  handleCloseModal = () => {
    this.props.setDashboardWizardStep();
    this.props.profileStore.reset();
    this.props.uiStore.clearErrors();
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.profileStore.setSubmitVerificationDocs(true);
    validationActions.validateConfirmIdentityDocumentsForm();
    if (this.props.profileStore.canSubmitConfirmIdentityDocumentsForm) {
      this.props.profileStore.uploadAndUpdateCIPInfo().then(() => {
        this.props.profileStore.startPhoneVerification().then(() => {
          this.props.setDashboardWizardStep('ConfirmPhoneNumber');
        })
          .catch((err) => {
            this.props.uiStore.setErrors(JSON.stringify(err.message));
          });
      })
        .catch(() => { });
    }
  }

  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const { confirmIdentityDocuments, submitVerificationsDocs } = this.props.profileStore;
    const { errors, confirmBox } = this.props.uiStore;
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
          {errors && errors.message &&
            <Message error textAlign="left">
              <ListErrors errors={[errors.message]} />
            </Message>
          }
          {errors && !errors.message &&
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
                  <DropZone
                    name="photoId"
                    fielddata={confirmIdentityDocuments.fields.photoId}
                    ondrop={this.onPhotoIdDrop}
                    onremove={this.confirmRemoveDoc}
                  />
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
                  <DropZone
                    name="proofOfResidence"
                    fielddata={confirmIdentityDocuments.fields.proofOfResidence}
                    ondrop={this.onProofOfResidenceDrop}
                    onremove={this.confirmRemoveDoc}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider section hidden />
            <div className="center-align">
              <Button loading={submitVerificationsDocs && this.props.uiStore.inProgress} primary size="large" className="very relaxed" disabled={!confirmIdentityDocuments.meta.isValid}>Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button type="button" className="cancel-link" onClick={() => this.handleCloseModal()}>I`ll finish this letter</Button>
            </div>
          </Form>
          <Confirm
            header="Confirm"
            content="Are you sure you want to remove this file?"
            open={confirmBox.entity === 'proofOfResidence' || confirmBox.entity === 'photoId'}
            onCancel={this.handleDelCancel}
            onConfirm={() => this.handleDelDoc(confirmBox.entity)}
            size="mini"
            className="deletion"
          />
        </Modal.Content>
      </Modal>
    );
  }
}
