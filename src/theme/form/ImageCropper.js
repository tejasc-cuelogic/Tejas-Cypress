import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Icon } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

@observer
export default class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crop: {
        x: 0,
        y: 0,
        // aspect: 16 / 9,
      },
      minWidth: 20,
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
    this.props.handelReset();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    this.props.setData('value', files[0].name);
    this.props.verifySize(files[0].size);
    this.props.verifyExtension(files[0].type.split('/')[1]);
    const reader = new FileReader();
    reader.onload = () => {
      this.props.setData('src', reader.result);
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
    this.props.setData('base64String', croppedImg);
  }

  render() {
    const { profilePhoto } = this.props.fieldData.fields;
    return (
      <div>
        { profilePhoto.src && !profilePhoto.error ?
          <ReactCrop
            {...this.state}
            src={profilePhoto.src}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
            crop={this.state.crop}
          />
        :
          <div className="file-uploader">
            <div className="file-uploader-inner">
              <Icon className="ns-upload" /> Choose a file <span>or drag it here</span>
            </div>
            <input type="file" onChange={this.onChange} accept=".jpg, .jpeg, .png" />
            {profilePhoto.error &&
              <FieldError error={profilePhoto.error} />
            }
          </div>
        }
      </div>
    );
  }
}
