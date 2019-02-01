import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Form, Button } from 'semantic-ui-react';
import { ImageCropper } from '../../../../../theme/form';
import {
  PROFILE_PHOTO_BYTES, PROFILE_PHOTO_EXTENSIONS,
} from '../../../../../services/constants/user';

@inject('teamStore', 'uiStore')
@withRouter
@observer
export default class UpdateMemberProfilePhoto extends Component {
  setData = (attr, value, field) => {
    this.props.teamStore.setProfilePhoto(attr, value, field);
  }
  uploadProfilePhoto = () => {
    // const backURL = `${this.props.refLink}/new`;
    const backURL = `${this.props.refLink}/${this.props.match.params.action}`;
    this.props.teamStore.uploadProfilePhoto('avatar').then(() => {
      this.props.history.push(backURL);
    });
  }

  handleVerifyFileSize = (fileSize) => {
    if (fileSize > PROFILE_PHOTO_BYTES) {
      const field = 'error';
      const errorMsg = 'File size cannot be more than 5 MB.';
      this.props.teamStore.setProfilePhoto(field, errorMsg);
      this.props.teamStore.setProfilePhoto('value', '');
    }
  }

  handleVerifyFileExtension = (fileExt) => {
    if (PROFILE_PHOTO_EXTENSIONS.indexOf(fileExt) === -1) {
      const field = 'error';
      const errorMsg = `Only ${PROFILE_PHOTO_EXTENSIONS.join(', ')}  extensions are allowed.`;
      this.props.teamStore.setProfilePhoto(field, errorMsg);
      this.props.teamStore.setProfilePhoto('value', '');
    }
  }

  handelImageDeimension = (width, height) => {
    if (width < 200 || height < 200) {
      const field = 'error';
      const errorMsg = 'Image size should not be less than 200 x 200.';
      this.props.teamStore.setProfilePhoto(field, errorMsg);
      this.props.teamStore.setProfilePhoto('value', '');
    }
  }

  handleresetProfilePhoto = () => {
    this.props.teamStore.resetProfilePhoto('avatar');
  }

  handleCloseModal = () => {
    if (this.props.refLink) {
      const gobackURL = `${this.props.refLink}/${this.props.match.params.action}`;
      this.props.history.push(gobackURL);
    }
    this.props.teamStore.resetProfilePhoto('avatar');
  }

  render() {
    // resetProfilePhoto
    const { TEAM_FRM, canUpdateProfilePhoto } = this.props.teamStore;
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
              fieldData={TEAM_FRM}
              // setData={this.setData}
              setData={(attr, value) => this.setData(attr, value, 'avatar')}
              verifySize={this.handleVerifyFileSize}
              verifyExtension={this.handleVerifyFileExtension}
              handelReset={this.handleresetProfilePhoto}
              verifyImageDimension={this.handelImageDeimension}
              field={TEAM_FRM.fields.avatar}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button loading={inProgress} disabled={!canUpdateProfilePhoto} primary content="Set Profile Photo" onClick={this.uploadProfilePhoto} />
          {/*
        <Button disabled={!canUpdateProfilePhoto} content="Clear"
        onClick={() => resetProfilePhoto('avatar')} /> */}
        </Modal.Actions>
      </Modal>
    );
  }
}

