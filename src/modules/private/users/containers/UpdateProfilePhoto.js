import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Form, Button, Icon } from 'semantic-ui-react';

@inject('profileStore')
@withRouter
@observer
export default class UpdateProfilePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crop: {
        x: 0,
        y: 0,
        // aspect: 16 / 9,
      },
      minWidth: 20,
      // minHeight: 20,
      keepSelection: true,
      fileObject: '',
      pixelCrop: '',
      cropResult: '',
      image: '',
    };
  }
  /* eslint-disable prefer-destructuring */
  onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    this.setState({
      fileObject: files[0],
    });
    this.props.profileStore.setProfilePhoto('value', files[0].name);
    const reader = new FileReader();
    reader.onload = () => {
      this.props.profileStore.setProfilePhoto('src', reader.result);
    };
    reader.readAsDataURL(files[0]);
  }

  onImageLoaded = (image) => {
    this.setState({
      crop: makeAspectCrop({
        x: 20,
        y: 20,
        aspect: 1 / 1,
        width: 20,
      }, image.width / image.height),
      image,
    });
  }

  onCropComplete = (crop, pixelCrop) => {
    this.setState({
      pixelCrop,
    });
    this.test();
  }

  onCropChange = (crop) => {
    this.setState({ crop });
  }
  /**
   * @param {File} image - Image File Object
   * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
   */
  /* eslint-disable class-methods-use-this */
  getCroppedImg(image, pixelCrop) {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    const base64Image = canvas.toDataURL('image/jpg');
    return base64Image;
  }

  async test() {
    const image = this.state.image;
    const pixelCrop = this.state.pixelCrop;
    const croppedImg = await this.getCroppedImg(image, pixelCrop);
    this.setState({ cropResult: croppedImg });
  }
  handleCloseModal = () => {
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    }
  }
  uploadProfilePhoto = () => {
    this.props.profileStore.setProfilePhoto('base64String', this.state.cropResult);
    this.props.profileStore.uploadProfilePhoto();
  }
  render() {
    const { profilePhoto } = this.props.profileStore;
    return (
      <Modal open closeIcon onClose={() => this.handleCloseModal()}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content>
          <Form className="cropper-wrap">
            <ReactCrop
              {...this.state}
              src={profilePhoto.src}
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
              crop={this.state.crop}
            />
            <div className="file-uploader">
              <div className="file-uploader-inner">
                <Icon className="ns-upload" /> Choose a file <span>or drag it here</span>
              </div>
              <input type="file" onChange={this.onChange} />
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button primary content="Set Profile Photo" onClick={this.cropImage} />
          <Button content="Clear" />
        </Modal.Actions>
      </Modal>
    );
  }
}
