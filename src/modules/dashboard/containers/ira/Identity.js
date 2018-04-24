import React, { Component } from 'react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FileUploaderInline } from '../../../../components/form/FormElements';

@inject('accountStore')
@observer
export default class Identity extends Component {
  uploadDocument = (name, files) => {
    if (files.length) {
      const uploadFile = files[0];
      this.props.accountStore.setIraAccountDetails(name, uploadFile.name);
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
          <FileUploaderInline
            name={driversLicence.key}
            fielddata={driversLicence}
            uploadDocument={this.uploadDocument}
            removeUploadedDocument={this.removeUploadedDriversLicence}
          />
        </Form>
        <Divider section hidden />
        <p className="center-align">As a regulated financial service company operating in the US we are periodically
          required to identify users on the  platform. That’s why lorem ipsum dolor sit amet
        </p>
      </div>
    );
  }
}
