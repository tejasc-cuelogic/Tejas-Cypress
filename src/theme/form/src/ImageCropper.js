import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer } from 'mobx-react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Icon, Modal, Header, Button } from 'semantic-ui-react';
import { FieldError } from '../../shared';

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
      imageType: '',
      close: true,
    };
  }
  onChange = (e) => {
    e.preventDefault();
    this.props.handelReset();
    const { files } = (e.dataTransfer) ? e.dataTransfer : e.target;

    this.setState({ imageType: files[0].type });
    this.props.setData('fileName', files[0].name);
    this.props.setData('meta', { type: files[0].type, ext: files[0].type.split('/')[1] });
    if (this.props.verifySize) {
      this.props.verifySize(files[0].size, this.props.name);
    }
    this.props.verifyExtension(files[0].type.split('/')[1]);
    const reader = new FileReader();
    reader.onload = () => {
      this.props.setData('src', reader.result);
    };
    reader.readAsDataURL(files[0]);
  }

  onImageLoaded = (image) => {
    this.props.verifyImageDimension(image.width, image.height, this.props.name);
    const minimumWidth = 200;
    const cropWidthPer = (minimumWidth / image.width) * 100;
    this.setState({
      crop: makeAspectCrop({
        x: 0,
        y: 0,
        aspect: this.props.aspect ?
          this.props.aspect === 'none' ? null : this.props.aspect : 1 / 1,
        width: cropWidthPer,
      }, image.width / image.height),
      image,
      minWidth: cropWidthPer,
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
    return canvas.toDataURL(this.state.imageType); // base 64
  }

  handleCloseModal = () => {
    this.setState({
      close: true,
      crop: {
        x: 0,
        y: 0,
      },
      image: '',
      minWidth: 20,
    });
    this.props.handelReset();
  }

  modalUpload = (name, field) => {
    this.props.modalUploadAction(name, field);
    this.handleCloseModal();
  }

  async test() {
    const { image, pixelCrop } = this.state;
    const croppedImg = await this.getCroppedImg(image, pixelCrop);
    this.props.setData('base64String', croppedImg);
  }

  render() {
    // const { profilePhoto } = this.props.fieldData.fields;
    const { field, cropInModal, disabled } = this.props;
    return (
      <Aux>
        { field.src && !field.error ? cropInModal ?
          <Modal closeOnRootNodeClick={false} closeIcon size="large" open={this.state.close} onClose={this.handleCloseModal} centered={false} closeOnDimmerClick={false}>
            <Modal.Content>
              <Header as="h3">Crop image for {field.label}</Header>
              <ReactCrop
                {...this.state}
                src={field.src}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
                crop={this.state.crop}
              />
            </Modal.Content>
            <Modal.Actions>
              <Button primary disabled={(this.props.aspect === 'none' && !this.state.crop.width)} content="Upload" onClick={() => this.modalUpload(this.props.name, field)} />
            </Modal.Actions>
          </Modal>
          :
          <ReactCrop
            {...this.state}
            src={field.src}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
            crop={this.state.crop}
          />
          :
          <Aux>
            <div className="file-uploader">
              <div className="file-uploader-inner">
                <Icon className="ns-upload" /> Choose a file&nbsp;<span>or drag it here</span>
              </div>
              <input disabled={disabled} type="file" onChange={this.onChange} accept=".jpg, .jpeg, .png" />
            </div>
            {field.error &&
              <FieldError error={field.error} />
            }
          </Aux>
        }
      </Aux>
    );
  }
}
