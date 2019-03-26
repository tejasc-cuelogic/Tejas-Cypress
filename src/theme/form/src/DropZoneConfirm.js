/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Responsive, Button, Popup, Dimmer, Loader, Confirm } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Aux from 'react-aux';
import { isArray } from 'lodash';
import { FieldError } from '../../shared';
import { NEXTSEED_BOX_URL } from '../../../constants/common';


@inject('commonStore')
@observer
export default class DropZone extends Component {
  state = { showConfirmModal: false, fileName: null, key: null };

  removeForm = () => {
    this.setState({ showConfirmModal: !this.state.showConfirmModal });
    this.props.onremove(this.state.fileName, this.state.key);
  }

  toggleConfirm = (e, fileName, key) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      showConfirmModal: !this.state.showConfirmModal,
      fileName,
      key,
    });
  }

  handelGetFileHandel = (e, fileId) => {
    e.preventDefault();
    this.props.commonStore.getBoxFileDetails(fileId).then((response) => {
      const boxFileId = response && response.getFileDetails &&
      response.getFileDetails.boxFileId;
      if (boxFileId) {
        window.open(`${NEXTSEED_BOX_URL}file/${boxFileId}`, '_blank');
      }
    });
  }

  render() {
    const {
      label,
      value,
      error,
      showLoader,
      fileId,
    } = this.props.fielddata;
    const { hideFields, size } = this.props;
    return (
      <div className={`file-uploader-wrap ${this.props.containerclassname}`}>
        {label &&
          <label>
            {(this.props.asterisk && this.props.asterisk === 'true' ? `${label}*` : label)}
            {this.props.tooltip &&
            <Popup
              trigger={<Icon className="ns-help-circle" />}
              content={this.props.tooltip}
              position="top center"
              className={this.props.toolTipClassName ? this.props.toolTipClassName : 'center-align'}
              wide
            />
            }
          </label>
        }
        { !this.props.disabled && (!value || this.props.multiple) ?
          <div className="file-uploader">
            <Dimmer active={showLoader}>
              <Loader size={size} />
            </Dimmer>
            <Dropzone {...this.props} multiple={this.props.multiple || false} onDrop={files => this.props.ondrop(files, this.props.name)} className="test" style={{}}>
              <Icon className="ns-upload" /> {this.props.uploadtitle ? <span>{this.props.uploadtitle}</span> : <span>Upload document{this.props.multiple ? 's' : ''}</span>}
            </Dropzone>
          </div> : null
        }
        {(isArray(toJS(value)) && value.length) ?
          value.map((item, key) => (
            <div className={hideFields ? 'downloadable file-uploader attached' : 'file-uploader attached'}>
              {!this.props.disabled &&
                <Aux>
                  <Responsive
                    as={Button}
                    minWidth={768}
                    size="tiny"
                    compact
                    className="ghost-button remove pull-right"
                    onClick={e => this.toggleConfirm(e, this.props.name, key)}
                  >
                    Remove
                  </Responsive>
                  <Responsive
                    as={Icon}
                    maxWidth={767}
                    name="remove"
                    className="pull-right"
                    onClick={e => this.toggleConfirm(e, this.props.name, key)}
                  />
                </Aux>
              }
              {hideFields ?
                <Link as={Button} to="/" onClick={e => this.handelGetFileHandel(e, fileId)} title={item}><Icon className="ns-file" />{item}</Link> :
                <span title={item}>{item}</span>
              }
            </div>
          )) : !isArray(toJS(value)) && value ?
            <div className={hideFields ? 'downloadable file-uploader attached' : 'file-uploader attached'}>
              {!this.props.disabled &&
                <Aux>
                  <Responsive
                    as={Button}
                    minWidth={768}
                    size="tiny"
                    compact
                    className="ghost-button remove pull-right"
                    onClick={e => this.toggleConfirm(e, this.props.name)}
                  >
                    Remove
                  </Responsive>
                  <Responsive
                    as={Icon}
                    maxWidth={767}
                    name="remove"
                    className="pull-right"
                    onClick={e => this.toggleConfirm(e, this.props.name)}
                  />
                </Aux>
              }
              {hideFields ?
                <Link as={Button} to="/" onClick={e => this.handelGetFileHandel(e, fileId)} title={value}><Icon className="ns-file" />{value}</Link> :
                <span title={value}>{value}</span>
              }
            </div> : hideFields &&
            <div className="downloadable file-uploader attached">
              <p>No files uploaded yet.</p>
            </div>
        }
        {error &&
          <FieldError error={error} />
        }
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={this.state.showConfirmModal}
          onCancel={this.toggleConfirm}
          onConfirm={this.removeForm}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
