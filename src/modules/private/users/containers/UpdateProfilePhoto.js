import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Form, Button } from 'semantic-ui-react';
import ImageCropper from '../../../../theme/form/ImageCropper';
import { PROFILE_PHOTO_BYTES, PROFILE_PHOTO_EXTENSIONS } from '../../../../constants/profile';

@inject('profileStore', 'uiStore')
@withRouter
@observer
export default class UpdateProfilePhoto extends Component {
  setData = (field, value) => {
    this.props.profileStore.setProfilePhoto(field, value);
  }

  uploadProfilePhoto = () => {
    this.props.profileStore.uploadProfilePhoto(this.props.history, this.props.refLink);
  }

  handleVerifyFileSize = (fileSize) => {
    if (fileSize > PROFILE_PHOTO_BYTES) {
      const field = 'error';
      const errorMsg = 'File size Greater than 5MB';
      this.props.profileStore.setProfilePhoto(field, errorMsg);
      this.props.profileStore.setProfilePhoto('value', '');
    }
  }

  handleVerifyFileExtension = (fileExt) => {
    if (PROFILE_PHOTO_EXTENSIONS.indexOf(fileExt) === -1) {
      const field = 'error';
      const errorMsg = `Only ${PROFILE_PHOTO_EXTENSIONS.join(', ')}  extensions are allowed.`;
      this.props.profileStore.setProfilePhoto(field, errorMsg);
      this.props.profileStore.setProfilePhoto('value', '');
    }
  }

  handelImageDeimension = (width, height) => {
    if (width < 200 || height < 200) {
      const field = 'error';
      const errorMsg = 'Image size should not be less than 200 x 200.';
      this.props.profileStore.setProfilePhoto(field, errorMsg);
      this.props.profileStore.setProfilePhoto('value', '');
    }
  }

  handleresetProfilePhoto = () => {
    this.props.profileStore.resetProfilePhoto();
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
              verifyExtension={this.handleVerifyFileExtension}
              handelReset={this.handleresetProfilePhoto}
              verifyImageDimension={this.handelImageDeimension}
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
