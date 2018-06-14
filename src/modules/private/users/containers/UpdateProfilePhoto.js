import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Header, Modal, Form } from 'semantic-ui-react';

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
      maxHeight: 80,
      fileObject: '',
      pixelCrop: '',
      cropResult: '',
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
    const reader = new FileReader();
    reader.onload = () => {
      this.props.profileStore.setProfilePhoto('src', reader.result);
    };
    reader.readAsDataURL(files[0]);
  }

  onImageLoaded = (image) => {
    this.setState({
      crop: makeAspectCrop({
        x: 0,
        y: 0,
        aspect: 1 / 1,
        width: 50,
      }, image.naturalWidth / image.naturalHeight),
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
  getCroppedImg(image, pixelCrop) {
    console.log(this);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    const myImageUrl = URL.createObjectURL(image);
    const myImage = new Image();
    myImage.src = myImageUrl;

    ctx.drawImage(
      myImage,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    // As Base64 string
    const base64Image = canvas.toDataURL('image/jpeg');
    return base64Image;
  }

  async test() {
    const image = this.state.fileObject;
    const pixelCrop = this.state.pixelCrop;
    const croppedImg = await this.getCroppedImg(image, pixelCrop, image.name);
    this.setState({ cropResult: croppedImg });
  }

  cropImage = () => {
    this.props.profileStore.setProfilePhoto('croppedResult', this.state.cropResult);
    this.props.history.push(this.props.refLink);
  }
  handleCloseModal = () => {
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    }
  }
  render() {
    const { profilePhoto } = this.props.profileStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>Default Profile Image</Header>
            <Form className="file-uploader-large">
              <input type="file" onChange={this.onChange} />
              <ReactCrop
                {...this.state}
                src={profilePhoto.src}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
                crop={this.state.crop}
              />
              <div>
                <div className="box" style={{ width: '50%', float: 'right' }}>
                  <h1>
                    <span>Crop</span>
                    <button onClick={this.cropImage} style={{ float: 'right' }}>
                      Crop Image
                    </button>
                  </h1>
                </div>
              </div>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}
