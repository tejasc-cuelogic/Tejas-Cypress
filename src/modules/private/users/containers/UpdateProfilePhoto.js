import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Form, Button } from 'semantic-ui-react';
import ImageCropper from '../../../../theme/form/ImageCropper';

@inject('profileStore', 'uiStore')
@withRouter
@observer
export default class UpdateProfilePhoto extends Component {
  setData = (field, value) => {
    this.props.profileStore.setProfilePhoto(field, value);
  }

  uploadProfilePhoto = () => {
    this.props.profileStore.uploadProfilePhoto();
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    }
  }

  handleVerifyFileSize = (fileSize) => {
    if (fileSize > 5242880) {
      const field = 'error';
      const errorMsg = 'File size Greater then 5MB';
      this.props.profileStore.setProfilePhoto(field, errorMsg);
    }
  }

  handleCloseModal = () => {
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    }
    this.props.profileStore.resetProfilePhoto();
  }

  render() {
    const { updateProfileInfo, canUpdateProfilePhoto, resetProfilePhoto } = this.props.profileStore;
    const { inProgress } = this.props.uiStore;
    return (
      <Modal open closeIcon onClose={() => this.handleCloseModal()}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content>
          <Form className="cropper-wrap">
            <ImageCropper
              fieldData={updateProfileInfo}
              setData={this.setData}
              verifySize={this.handleVerifyFileSize}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button loading={inProgress} disabled={!canUpdateProfilePhoto} primary content="Set Profile Photo" onClick={this.uploadProfilePhoto} />
          <Button disabled={!canUpdateProfilePhoto} content="Clear" onClick={() => resetProfilePhoto()} />
        </Modal.Actions>
      </Modal>
    );
  }
}
