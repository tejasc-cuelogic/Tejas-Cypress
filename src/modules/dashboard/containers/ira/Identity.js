import React, { Component } from 'react';
import { Header, Form, Icon, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('accountStore')
@observer
export default class Identity extends Component {
  uploadDocument = (e) => {
    if (e.target.files.length) {
      const uploadFile = e.target.files[0];
      this.props.accountStore.setIraAccountDetails(e.target.name, uploadFile.name);
    }
  }
  removeUploadedDriversLicence = () => {
    this.props.accountStore.setIraAccountDetails('driversLicence', '');
  }
  render() {
    const { driversLicence } = this.props.accountStore.iraAccount;
    return (
      <div>
        <Header as="h1" textAlign="center">Confirm your identity and upload your drivers license</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</Header>
        <Divider section hidden />
        <Form className="file-uploader-inline">
          <Form.Field>
            {driversLicence.value === '' &&
              <div className="file-uploader">
                <Icon name="upload" /> Choose a file <span>or drag it here</span>
                <input
                  name={driversLicence.key}
                  type="file"
                  onChange={this.uploadDocument}
                  accept=".jpg,.jpeg,.pdf"
                />
              </div>
            }
            {driversLicence.value !== '' &&
              <div className="file-uploader attached">
                <span title={driversLicence.value}>{driversLicence.value}</span>
                <Icon name="remove" onClick={this.removeUploadedDriversLicence} />
              </div>
            }
          </Form.Field>
        </Form>
        <Divider section hidden />
        <p className="center-align">As a regulated financial service company operating in the US we are periodically
          required to identify users on the  platform. That’s why lorem ipsum dolor sit amet
        </p>
      </div>
    );
  }
}
