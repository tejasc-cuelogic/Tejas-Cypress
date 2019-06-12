import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Form, Button } from 'semantic-ui-react';
import { ImageCropper } from '../../../../../../theme/form';
import {
  PROFILE_PHOTO_BYTES, PROFILE_PHOTO_EXTENSIONS,
} from '../../../../../../services/constants/user';

@inject('identityStore', 'uiStore')
@withRouter
@observer
export default class UpdateProfilePhoto extends Component {
  setData = (field, value) => {
    this.props.identityStore.setProfilePhoto(field, value);
  }

  uploadProfilePhoto = () => {
    this.props.identityStore.uploadProfilePhoto().then(() => {
      this.props.history.push(this.props.refLink);
    });
  }

  handleVerifyFileSize = (fileSize) => {
    if (fileSize > PROFILE_PHOTO_BYTES) {
      const field = 'error';
      const errorMsg = 'File size cannot be more than 5 MB.';
      this.props.identityStore.setProfilePhoto(field, errorMsg);
      this.props.identityStore.setProfilePhoto('value', '');
    }
  }

  handleVerifyFileExtension = (fileExt) => {
    if (PROFILE_PHOTO_EXTENSIONS.indexOf(fileExt) === -1) {
      const field = 'error';
      const errorMsg = `Only ${PROFILE_PHOTO_EXTENSIONS.join(', ')}  extensions are allowed.`;
      this.props.identityStore.setProfilePhoto(field, errorMsg);
      this.props.identityStore.setProfilePhoto('value', '');
    }
  }

  handelImageDeimension = (width, height) => {
    if (width < 200 || height < 200) {
      const field = 'error';
      const errorMsg = 'Image size should not be less than 200 x 200.';
      this.props.identityStore.setProfilePhoto(field, errorMsg);
      this.props.identityStore.setProfilePhoto('value', '');
    }
  }

  handleresetProfilePhoto = () => {
    this.props.identityStore.resetProfilePhoto();
  }

  handleCloseModal = () => {
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    }
    this.props.identityStore.resetProfilePhoto();
  }

  render() {
    const { ID_PROFILE_INFO, canUpdateProfilePhoto, resetProfilePhoto } = this.props.identityStore;
    const { inProgress } = this.props.uiStore;
    return (
      <Modal
        open
        closeIcon
        closeOnRootNodeClick={false}
        onClose={() => this.handleCloseModal()}
        closeOnDimmerClick={false}
      >
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content>
          <Form className="cropper-wrap">
            <ImageCropper
              fieldData={ID_PROFILE_INFO}
              setData={this.setData}
              verifySize={this.handleVerifyFileSize}
              verifyExtension={this.handleVerifyFileExtension}
              handelReset={this.handleresetProfilePhoto}
              verifyImageDimension={this.handelImageDeimension}
              field={ID_PROFILE_INFO.fields.profilePhoto}
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
