import React, { Component } from 'react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FileUploaderLarge } from '../../../../components/form/FormElements';

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
        <Form className="file-uploader-large">
          {/* <Grid>
            <Grid.Row>
              <Grid.Column width={7}>
                {/* eslint-disable jsx-a11y/label-has-for * /}
                <label>
                  <h3>Upload a Photo ID</h3>
                  Driving Liscence or passport
                </label>
              </Grid.Column>
              <Grid.Column width={9}>
                {driversLicence.value === '' &&
                  <div className="file-uploader">
                    <Icon className="ns-upload" /> Choose a file <span>or drag it here</span>
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
                    <Icon className="ns-close" size="small"
                    onClick={this.removeUploadedDriversLicence} />
                  </div>
                }
              </Grid.Column>
            </Grid.Row>
          </Grid> */}
          <FileUploaderLarge
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
