import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Image, Button, List } from 'semantic-ui-react';
import { ImageCropper } from '../../../../../theme/form';
import HeroImage from '../../../../../assets/images/hero-image.jpg';
import TombstoneImage from '../../../../../assets/images/tombstone-image.jpg';
import GalleryImage from '../../../../../assets/images/gallery-image.jpg';
import LogoImage from '../../../../../assets/images/gardens-america.jpg';
import {
  PROFILE_PHOTO_BYTES, PROFILE_PHOTO_EXTENSIONS,
} from '../../../../../services/constants/user';

@inject('offeringCreationStore', 'uiStore')
@withRouter
@observer
export default class Media extends Component {
  setData = (attr, value, fieldName) => {
    this.props.offeringCreationStore.setProfilePhoto(attr, value, fieldName);
  }
  handleresetProfilePhoto = (field) => {
    this.props.offeringCreationStore.resetProfilePhoto(field);
  }
  handleVerifyFileSize = (fileSize) => {
    if (fileSize > PROFILE_PHOTO_BYTES) {
      const field = 'error';
      const errorMsg = 'File size cannot be more than 5 MB.';
      this.props.offeringCreationStore.setProfilePhoto(field, errorMsg);
      this.props.offeringCreationStore.setProfilePhoto('value', '');
    }
  }

  handleVerifyFileExtension = (fileExt) => {
    if (PROFILE_PHOTO_EXTENSIONS.indexOf(fileExt) === -1) {
      const field = 'error';
      const errorMsg = `Only ${PROFILE_PHOTO_EXTENSIONS.join(', ')}  extensions are allowed.`;
      this.props.offeringCreationStore.setProfilePhoto(field, errorMsg);
      this.props.offeringCreationStore.setProfilePhoto('value', '');
    }
  }

  handelImageDeimension = (width, height) => {
    if (width < 200 || height < 200) {
      const field = 'error';
      const errorMsg = 'Image size should not be less than 200 x 200.';
      this.props.offeringCreationStore.setProfilePhoto(field, errorMsg);
      this.props.offeringCreationStore.setProfilePhoto('value', '');
    }
  }
  render() {
    const { MEDIA_FRM } = this.props.offeringCreationStore;
    return (
      <div className="inner-content-spacer">
        <Header as="h4">Hero Image</Header>
        <Form className="cropper-wrap hero-img">
          <ImageCropper
            fieldData={MEDIA_FRM.fields.heroImage}
            setData={(attr, value) => this.setData(attr, value, 'heroImage')}
            verifySize={this.handleVerifyFileSize}
            verifyExtension={this.handleVerifyFileExtension}
            handelReset={() => this.handleresetProfilePhoto('heroImage')}
            verifyImageDimension={this.handelImageDeimension}
            field={MEDIA_FRM.fields.heroImage}
            cropInModal
          />
          <div className="file-uploader attached">
            <Button circular icon={{ className: 'ns-close-light' }} />
            <Image src={HeroImage} />
          </div>
        </Form>
        <Divider section />
        <Header as="h4">Tombstone image</Header>
        <Form className="cropper-wrap tombstone-img">
          <ImageCropper
            fieldData={MEDIA_FRM.fields.tombstoneImage}
            setData={(attr, value) => this.setData(attr, value, 'tombstoneImage')}
            verifySize={this.handleVerifyFileSize}
            verifyExtension={this.handleVerifyFileExtension}
            handelReset={() => this.handleresetProfilePhoto('tombstoneImage')}
            verifyImageDimension={this.handelImageDeimension}
            field={MEDIA_FRM.fields.tombstoneImage}
            cropInModal
          />
          <div className="file-uploader attached">
            <Button circular icon={{ className: 'ns-close-light' }} />
            <Image src={TombstoneImage} />
          </div>
        </Form>
        <Divider section />
        <Header as="h4">Location Image</Header>
        <Form className="cropper-wrap gallery-img">
          <List horizontal>
            {
              [1, 2].map(i => (
                <List.Item key={i}>
                  <div className="file-uploader attached">
                    <Button circular icon={{ className: 'ns-close-light' }} />
                    <Image src={GalleryImage} />
                  </div>
                </List.Item>
              ))
            }
            <List.Item>
              <ImageCropper
                fieldData={MEDIA_FRM.fields.tombstoneImage}
                setData={(attr, value) => this.setData(attr, value, 'tombstoneImage')}
                verifySize={this.handleVerifyFileSize}
                verifyExtension={this.handleVerifyFileExtension}
                handelReset={() => this.handleresetProfilePhoto('tombstoneImage')}
                verifyImageDimension={this.handelImageDeimension}
                field={MEDIA_FRM.fields.tombstoneImage}
                cropInModal
              />
            </List.Item>
          </List>
        </Form>
        <Divider section />
        <Header as="h4">Gallery</Header>
        <Form className="cropper-wrap gallery-img">
          <List horizontal>
            {
              [1, 2, 3, 4, 5, 6].map(i => (
                <List.Item key={i}>
                  <div className="file-uploader attached">
                    <Button circular icon={{ className: 'ns-close-light' }} />
                    <Image src={GalleryImage} />
                  </div>
                </List.Item>
              ))
            }
            <List.Item>
              <ImageCropper
                fieldData={MEDIA_FRM.fields.tombstoneImage}
                setData={(attr, value) => this.setData(attr, value, 'tombstoneImage')}
                verifySize={this.handleVerifyFileSize}
                verifyExtension={this.handleVerifyFileExtension}
                handelReset={() => this.handleresetProfilePhoto('tombstoneImage')}
                verifyImageDimension={this.handelImageDeimension}
                field={MEDIA_FRM.fields.tombstoneImage}
                cropInModal
              />
            </List.Item>
          </List>
        </Form>
        <Divider section />
        <Header as="h4">Logo</Header>
        <Form className="cropper-wrap gallery-img">
          <List horizontal>
            <List.Item>
              <div className="file-uploader attached">
                <Button circular icon={{ className: 'ns-close-light' }} />
                <Image src={LogoImage} />
              </div>
            </List.Item>
            <List.Item>
              <ImageCropper
                fieldData={MEDIA_FRM.fields.tombstoneImage}
                setData={(attr, value) => this.setData(attr, value, 'tombstoneImage')}
                verifySize={this.handleVerifyFileSize}
                verifyExtension={this.handleVerifyFileExtension}
                handelReset={() => this.handleresetProfilePhoto('tombstoneImage')}
                verifyImageDimension={this.handelImageDeimension}
                field={MEDIA_FRM.fields.tombstoneImage}
                cropInModal
              />
            </List.Item>
          </List>
        </Form>
      </div>
    );
  }
}
