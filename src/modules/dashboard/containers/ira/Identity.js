import React, { Component } from 'react';
import { Grid, Header, Form, Icon } from 'semantic-ui-react';
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
  render() {
    const { driversLicence } = this.props.accountStore.iraAccount;
    return (
      <div>
        <Header as="h2">Confirm your identity and upload your drivers license</Header>
        <Grid textAlign="center">
          <Form error className="file-uploader-inline">
            <Form.Field>
              <div className="file-uploader">
                <Icon name="upload" /> Choose a file <span>or drag it here</span>
                <input
                  name={driversLicence.key}
                  type="file"
                  onChange={this.uploadDocument}
                />
                {driversLicence.value}
              </div>
            </Form.Field>
          </Form>
        </Grid>
      </div>
    );
  }
}
