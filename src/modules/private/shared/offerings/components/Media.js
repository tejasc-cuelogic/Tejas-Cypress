import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Header, Icon, Divider, Button, List, Confirm, Grid, Label } from 'semantic-ui-react';
import { ImageCropper } from '../../../../../theme/form';
import { Image64 } from '../../../../../theme/shared';
import {
  PROFILE_PHOTO_BYTES, PROFILE_PHOTO_EXTENSIONS,
} from '../../../../../services/constants/user';

@inject('offeringCreationStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class Media extends Component {
  state = { ConfirmModal: false, imageType: '', index: undefined }
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('MEDIA_FRM', 'media');
  }
  setData = (attr, value, fieldName) => {
    this.props.offeringCreationStore.setProfilePhoto(attr, value, fieldName);
  }
  handleresetProfilePhoto = (field) => {
    this.props.offeringCreationStore.resetProfilePhoto(field);
  }

  uploadMedia = (name) => {
    this.props.offeringCreationStore.uploadMedia(name);
  }

  removeMedia = (name, index) => {
    this.props.offeringCreationStore.removeMedia(name, index);
  }

  handleVerifyFileSize = (fileSize, field) => {
    if (fileSize > PROFILE_PHOTO_BYTES) {
      const attr = 'error';
      const errorMsg = 'File size cannot be more than 5 MB.';
      this.props.offeringCreationStore.setProfilePhoto(attr, errorMsg, field);
    }
  }

  handleVerifyFileExtension = (fileExt) => {
    if (PROFILE_PHOTO_EXTENSIONS.indexOf(fileExt) === -1) {
      const field = 'error';
      const errorMsg = `Only ${PROFILE_PHOTO_EXTENSIONS.join(', ')}  extensions are allowed.`;
      this.props.offeringCreationStore.setProfilePhoto(field, errorMsg);
    }
  }

  handelImageDeimension = (width, height, field) => {
    if (width < 200 || height < 200) {
      const attr = 'error';
      const errorMsg = 'Image size should not be less than 200 x 200.';
      this.props.offeringCreationStore.setProfilePhoto(attr, errorMsg, field);
    }
  }
  showConfirmModal = (imageType, index) => {
    this.setState({ imageType, index, ConfirmModal: true });
  }
  handleRemoveConfirm = () => {
    this.removeMedia(this.state.imageType, this.state.index);
    this.setState({ ConfirmModal: false });
  }
  handleRemoveCancel = () => {
    this.setState({ ConfirmModal: false, index: undefined });
  }
  handleFormSubmit = () => {
    const { MEDIA_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, MEDIA_FRM.fields, 'media');
  }
  render() {
    const { MEDIA_FRM, formChange } = this.props.offeringCreationStore;
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'inner-content-spacer' : 'ui card fluid form-card'}>
        <Grid columns={2} stackable>
          <Grid.Column>
            <Header as="h4">Hero Image</Header>
            <Form className="cropper-wrap hero-img">
              {MEDIA_FRM.fields.heroImage.preSignedUrl ? (
                <div className="file-uploader attached">
                  <Button onClick={() => this.showConfirmModal('heroImage')} circular icon={{ className: 'ns-close-light' }} />
                  <Image64 srcUrl={MEDIA_FRM.fields.heroImage.preSignedUrl} />
                </div>
              ) : (
                <ImageCropper
                  fieldData={MEDIA_FRM.fields.heroImage}
                  setData={(attr, value) => this.setData(attr, value, 'heroImage')}
                  verifySize={this.handleVerifyFileSize}
                  verifyExtension={this.handleVerifyFileExtension}
                  handelReset={() => this.handleresetProfilePhoto('heroImage')}
                  verifyImageDimension={this.handelImageDeimension}
                  field={MEDIA_FRM.fields.heroImage}
                  modalUploadAction={this.uploadMedia}
                  name="heroImage"
                  cropInModal
                  aspect={16 / 9}
                />
              )}
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Form className="comment-input video-url" onSubmit={this.handleFormSubmit}>
              <Header as="h4">Hero Video</Header>
              <Input
                name="heroVideo"
                onChange={(e, result) => formChange(e, result, 'MEDIA_FRM')}
                value={MEDIA_FRM.fields.heroVideo.value}
                type="text"
                placeholder="Enter your Vimeo video ID here..."
                labelPosition="right"
                action
                fluid
              >
                <Label basic>https://vimeo.com/</Label>
                <input />
                <Button icon type="submit" basic>
                  <Icon className="ns-send-right" color="blue" size="large" />
                </Button>
              </Input>
            </Form>
          </Grid.Column>
        </Grid>
        <Divider section />
        <Header as="h4">Tombstone image</Header>
        <Form className="cropper-wrap tombstone-img">
          {MEDIA_FRM.fields.tombstoneImage.preSignedUrl ? (
            <div className="file-uploader attached">
              <Button onClick={() => this.showConfirmModal('tombstoneImage')} circular icon={{ className: 'ns-close-light' }} />
              <Image64 srcUrl={MEDIA_FRM.fields.tombstoneImage.preSignedUrl} />
            </div>
          ) : (
            <ImageCropper
              fieldData={MEDIA_FRM.fields.tombstoneImage}
              setData={(attr, value) => this.setData(attr, value, 'tombstoneImage')}
              verifySize={this.handleVerifyFileSize}
              verifyExtension={this.handleVerifyFileExtension}
              handelReset={() => this.handleresetProfilePhoto('tombstoneImage')}
              verifyImageDimension={this.handelImageDeimension}
              field={MEDIA_FRM.fields.tombstoneImage}
              modalUploadAction={this.uploadMedia}
              name="tombstoneImage"
              cropInModal
              aspect={3 / 2}
            />
          )}
        </Form>
        <Divider section />
        <Header as="h4">Location Image</Header>
        <Form className="cropper-wrap gallery-img">
          <List horizontal>
            {MEDIA_FRM.fields.location.preSignedUrl &&
            MEDIA_FRM.fields.location.preSignedUrl.length &&
            MEDIA_FRM.fields.location.preSignedUrl.map((url, i) => (
              <List.Item key={url}>
                <div className="file-uploader attached">
                  <Button onClick={() => this.showConfirmModal('location', i)} circular icon={{ className: 'ns-close-light' }} />
                  <Image64 srcUrl={url} />
                </div>
              </List.Item>
            ))}
            <List.Item>
              <ImageCropper
                fieldData={MEDIA_FRM.fields.location}
                setData={(attr, value) => this.setData(attr, value, 'location')}
                verifySize={this.handleVerifyFileSize}
                verifyExtension={this.handleVerifyFileExtension}
                handelReset={() => this.handleresetProfilePhoto('location')}
                verifyImageDimension={this.handelImageDeimension}
                field={MEDIA_FRM.fields.location}
                modalUploadAction={this.uploadMedia}
                name="location"
                cropInModal
                aspect={3 / 2}
              />
            </List.Item>
          </List>
        </Form>
        <Divider section />
        <Header as="h4">Gallery</Header>
        <Form className="cropper-wrap gallery-img">
          <List horizontal>
            {MEDIA_FRM.fields.gallery.preSignedUrl &&
            MEDIA_FRM.fields.gallery.preSignedUrl.length &&
            MEDIA_FRM.fields.gallery.preSignedUrl.map((url, i) => (
              <List.Item key={`gallery${url}`}>
                <div className="file-uploader attached">
                  <Button onClick={() => this.showConfirmModal('gallery', i)} circular icon={{ className: 'ns-close-light' }} />
                  <Image64 srcUrl={url} />
                </div>
              </List.Item>
            ))}
            <List.Item>
              <ImageCropper
                fieldData={MEDIA_FRM.fields.gallery}
                setData={(attr, value) => this.setData(attr, value, 'gallery')}
                verifySize={this.handleVerifyFileSize}
                verifyExtension={this.handleVerifyFileExtension}
                handelReset={() => this.handleresetProfilePhoto('gallery')}
                verifyImageDimension={this.handelImageDeimension}
                field={MEDIA_FRM.fields.gallery}
                modalUploadAction={this.uploadMedia}
                name="gallery"
                cropInModal
                aspect={16 / 9}
              />
            </List.Item>
          </List>
        </Form>
        <Divider section />
        <Header as="h4">Logo</Header>
        <Form className="cropper-wrap gallery-img">
          <List horizontal>
            {MEDIA_FRM.fields.logo.preSignedUrl && MEDIA_FRM.fields.logo.preSignedUrl.length &&
            MEDIA_FRM.fields.logo.preSignedUrl.map((url, i) => (
              <List.Item key={`logo${url}`}>
                <div className="file-uploader attached">
                  <Button onClick={() => this.showConfirmModal('logo', i)} circular icon={{ className: 'ns-close-light' }} />
                  <Image64 srcUrl={url} />
                </div>
              </List.Item>
            ))}
            <List.Item>
              <ImageCropper
                fieldData={MEDIA_FRM.fields.logo}
                setData={(attr, value) => this.setData(attr, value, 'logo')}
                verifySize={this.handleVerifyFileSize}
                verifyExtension={this.handleVerifyFileExtension}
                handelReset={() => this.handleresetProfilePhoto('logo')}
                verifyImageDimension={this.handelImageDeimension}
                field={MEDIA_FRM.fields.logo}
                modalUploadAction={this.uploadMedia}
                name="logo"
                cropInModal
                aspect="none"
              />
            </List.Item>
          </List>
        </Form>
        <Confirm
          content="Are you sure you want to remove this media file?"
          open={this.state.ConfirmModal}
          onCancel={this.handleRemoveCancel}
          onConfirm={this.handleRemoveConfirm}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
