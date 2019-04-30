import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Header, Icon, Divider, Button, List, Confirm, Grid, Label } from 'semantic-ui-react';
import { ImageCropper } from '../../../../../theme/form';
import { Image64 } from '../../../../../theme/shared';
import {
  // PROFILE_PHOTO_BYTES,
  PROFILE_PHOTO_EXTENSIONS,
} from '../../../../../services/constants/user';
import ButtonGroup from './ButtonGroup';

@inject('offeringCreationStore', 'uiStore', 'userStore', 'offeringsStore')
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

  // handleVerifyFileSize = (fileSize, field) => {
  //   if (fileSize > PROFILE_PHOTO_BYTES) {
  //     const attr = 'error';
  //     const errorMsg = 'File size cannot be more than 5 MB.';
  //     this.props.offeringCreationStore.setProfilePhoto(attr, errorMsg, field);
  //   }
  // }

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
  handleFormSubmit = (isApproved = null) => {
    const { MEDIA_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, MEDIA_FRM.fields, 'media', null, true, undefined, isApproved);
  }
  render() {
    const { MEDIA_FRM, formChange } = this.props.offeringCreationStore;
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.media &&
      offer.media.submitted) ? offer.media.submitted : null;
    const approved = (offer && offer.media &&
      offer.media.approved) ? offer.media.approved : null;
    const issuerSubmitted = (offer && offer.media &&
      offer.media.issuerSubmitted) ? offer.media.issuerSubmitted : null;
    const isReadonly = ((isIssuer && issuerSubmitted) || (submitted && !isManager && !isIssuer) ||
      (isManager && approved && approved.status));
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'inner-content-spacer' : 'ui card fluid form-card'}>
        <Grid columns={2} stackable>
          {['heroImage', 'heroBackground'].map(field => (
            <Grid.Column>
              <Header as="h4">{MEDIA_FRM.fields[field].label}</Header>
              <Form className="cropper-wrap hero-img">
                {MEDIA_FRM.fields[field].preSignedUrl ? (
                  <div className="file-uploader attached">
                    {!isReadonly &&
                      <Button onClick={() => this.showConfirmModal(field)} circular icon={{ className: 'ns-close-light' }} />
                    }
                    <Image64 srcUrl={MEDIA_FRM.fields[field].preSignedUrl} />
                  </div>
                ) : (
                  <ImageCropper
                    disabled={isReadonly}
                    fieldData={MEDIA_FRM.fields[field]}
                    setData={(attr, value) => this.setData(attr, value, field)}
                    // verifySize={this.handleVerifyFileSize}
                    verifyExtension={this.handleVerifyFileExtension}
                    handelReset={() => this.handleresetProfilePhoto(field)}
                    verifyImageDimension={this.handelImageDeimension}
                    field={MEDIA_FRM.fields[field]}
                    modalUploadAction={this.uploadMedia}
                    name={field}
                    cropInModal
                    aspect={16 / 9}
                  />
              )}
              </Form>
            </Grid.Column>))
        }
          <Grid.Column>
            <Form className="comment-input video-url" onSubmit={this.handleFormSubmit}>
              <Header as="h4">Hero Video</Header>
              <Input
                readOnly={isReadonly}
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
        <Grid columns={2} stackable>
          {['tombstoneImage',
          // 'locationHeroImage'
          ].map(field => (
            <Grid.Column>
              <Header as="h4">{MEDIA_FRM.fields[field].label}</Header>
              <Form className="cropper-wrap tombstone-img">
                {MEDIA_FRM.fields[field].preSignedUrl ? (
                  <div className="file-uploader attached">
                    {!isReadonly &&
                      <Button onClick={() => this.showConfirmModal(field)} circular icon={{ className: 'ns-close-light' }} />
                    }
                    <Image64 srcUrl={MEDIA_FRM.fields[field].preSignedUrl} />
                  </div>
                ) : (
                  <ImageCropper
                    disabled={isReadonly}
                    fieldData={MEDIA_FRM.fields[field]}
                    setData={(attr, value) => this.setData(attr, value, field)}
                    // verifySize={this.handleVerifyFileSize}
                    verifyExtension={this.handleVerifyFileExtension}
                    handelReset={() => this.handleresetProfilePhoto(field)}
                    verifyImageDimension={this.handelImageDeimension}
                    field={MEDIA_FRM.fields[field]}
                    modalUploadAction={this.uploadMedia}
                    name={field}
                    cropInModal
                    aspect={3 / 2}
                  />
              )}
              </Form>
            </Grid.Column>))
          }
        </Grid>
        <Divider section />
        {/* <Grid columns={2} stackable>
          {['useOfProceeds',
          // 'businessModelImage'
          ].map(field => (
            <Grid.Column>
              <Header as="h4">{MEDIA_FRM.fields[field].label}</Header>
              <Form className="cropper-wrap tombstone-img">
                {MEDIA_FRM.fields[field].preSignedUrl ? (
                  <div className="file-uploader attached">
                    {!isReadonly &&
                      <Button onClick={() => this.showConfirmModal(field)} circular
                      icon={{ className: 'ns-close-light' }} />
                    }
                    <Image64 srcUrl={MEDIA_FRM.fields[field].preSignedUrl} />
                  </div>
                ) : (
                  <ImageCropper
                    disabled={isReadonly}
                    fieldData={MEDIA_FRM.fields[field]}
                    setData={(attr, value) => this.setData(attr, value, field)}
                    // verifySize={this.handleVerifyFileSize}
                    verifyExtension={this.handleVerifyFileExtension}
                    handelReset={() => this.handleresetProfilePhoto(field)}
                    verifyImageDimension={this.handelImageDeimension}
                    field={MEDIA_FRM.fields[field]}
                    modalUploadAction={this.uploadMedia}
                    name={field}
                    cropInModal
                    aspect={3 / 2}
                  />
              )}
              </Form>
            </Grid.Column>))
            }
        </Grid>
        <Divider section /> */}
        <Header as="h4">Gallery</Header>
        <Form className="cropper-wrap gallery-img">
          <List horizontal>
            {MEDIA_FRM.fields.gallery.preSignedUrl &&
              MEDIA_FRM.fields.gallery.preSignedUrl.length &&
              MEDIA_FRM.fields.gallery.preSignedUrl.map((url, i) => (
                <List.Item key={`gallery${url}`}>
                  <div className="file-uploader attached">
                    {!isReadonly &&
                      <Button onClick={() => this.showConfirmModal('gallery', i)} circular icon={{ className: 'ns-close-light' }} />
                    }
                    <Image64 srcUrl={url} />
                  </div>
                </List.Item>
              ))}
            {!isReadonly &&
            <List.Item>
              <ImageCropper
                disabled={isReadonly}
                fieldData={MEDIA_FRM.fields.gallery}
                setData={(attr, value) => this.setData(attr, value, 'gallery')}
                // verifySize={this.handleVerifyFileSize}
                verifyExtension={this.handleVerifyFileExtension}
                handelReset={() => this.handleresetProfilePhoto('gallery')}
                verifyImageDimension={this.handelImageDeimension}
                field={MEDIA_FRM.fields.gallery}
                modalUploadAction={this.uploadMedia}
                name="gallery"
                cropInModal
                aspect="none"
              />
            </List.Item>
            }
          </List>
        </Form>
        <Divider section />
        <Grid columns={2} stackable>
          {['logo', 'avatar'].map(field => (
            <Grid.Column>
              <Header as="h4">{MEDIA_FRM.fields[field].label}</Header>
              <Form className="cropper-wrap headshot-img">
                {MEDIA_FRM.fields[field].preSignedUrl ? (
                  <div className="file-uploader attached">
                    {!isReadonly &&
                      <Button onClick={() => this.showConfirmModal(field)} circular icon={{ className: 'ns-close-light' }} />
                    }
                    <Image64 srcUrl={MEDIA_FRM.fields[field].preSignedUrl} />
                  </div>
                ) : (
                  <ImageCropper
                    disabled={isReadonly}
                    fieldData={MEDIA_FRM.fields[field]}
                    setData={(attr, value) => this.setData(attr, value, field)}
                    // verifySize={this.handleVerifyFileSize}
                    verifyExtension={this.handleVerifyFileExtension}
                    handelReset={() => this.handleresetProfilePhoto(field)}
                    verifyImageDimension={this.handelImageDeimension}
                    field={MEDIA_FRM.fields[field]}
                    modalUploadAction={this.uploadMedia}
                    name={field}
                    cropInModal
                    aspect={1 / 1}
                  />
              )}
              </Form>
            </Grid.Column>))
              }
        </Grid>
        <Divider section />
        <ButtonGroup
          isIssuer={isIssuer}
          submitted={submitted}
          isManager={isManager}
          formValid={MEDIA_FRM.meta.isValid}
          approved={approved}
          updateOffer={this.handleFormSubmit}
          issuerSubmitted={issuerSubmitted}
        />
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
