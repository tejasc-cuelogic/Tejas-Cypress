/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Icon, Responsive, Button, Popup, Dimmer, Loader, Confirm } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Aux from 'react-aux';
import { isArray } from 'lodash';
import { FieldError } from '../../shared';

@observer
export default class DropZone extends Component {
  state = { showConfirmModal: false, fileName: null, key: null };

  removeForm = (e) => {
    this.setState({ showConfirmModal: !this.state.showConfirmModal });
    this.props.onremove(e, this.state.fileName, this.state.key);
  }

  toggleConfirm = (e, fileName, key) => {
    this.setState({
      ...this.state,
      showConfirmModal: !this.state.showConfirmModal,
      fileName,
      key,
    });
  }

  render() {
    const {
      label,
      value,
      error,
      showLoader,
    } = this.props.fielddata;
    return (
      <div className={`file-uploader-wrap ${this.props.containerclassname}`}>
        {label &&
          <label>
            {label}
            {this.props.tooltip &&
            <Popup
              trigger={<Icon className="ns-help-circle" />}
              content={this.props.tooltip}
              position="top center"
              className="center-align"
              wide
            />
            }
          </label>
        }
        { !this.props.disabled && (!value || this.props.multiple) ?
          <div className="file-uploader">
            <Dimmer active={showLoader}>
              <Loader />
            </Dimmer>
            <Dropzone {...this.props} onDrop={files => this.props.ondrop(files, this.props.name)} className="test" style={{}}>
              <Icon className="ns-upload" /> {this.props.uploadtitle ? <span>{this.props.uploadtitle}</span> : <span>Upload document{this.props.multiple ? 's' : ''}</span>}
            </Dropzone>
          </div> : null
        }
        {(isArray(toJS(value)) && value.length) ?
          value.map((item, key) => (
            <div className="file-uploader attached">
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
              <span title={item}>{item}</span>
            </div>
          )) : !isArray(toJS(value)) && value &&
          <div className="file-uploader attached">
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
            <span title={value}>{value}</span>
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
