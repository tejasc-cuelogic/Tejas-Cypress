import React, { Component } from 'react';
import { Header, Form, Icon, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import FieldError from '../../../../components/common/FieldError';
import validationActions from '../../../../actions/validation';

@inject('accountStore', 'userStore')
@observer
export default class PersonalInformation extends Component {
  handleInputChange = (e, { name, value }) => {
    validationActions.validateEntityAccountField(name, value);
  }

  uploadDocument = (e) => {
    if (e.target.files.length) {
      const uploadFile = e.target.files[0];
      this.props.accountStore.setEntityAccountDetails(e.target.name, uploadFile.name);
    }
  }

  removeUploadedPhotoId = () => {
    this.props.accountStore.setEntityAccountDetails('photoId', '');
  }

  render() {
    const { entityAccount } = this.props.accountStore;
    const { currentUser } = this.props.userStore;

    return (
      <div>
        <Header as="h1" textAlign="center">Complete personal info about entity</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Header>
        <Form error>
          <div className="field-wrap">
            <Form.Input
              label="Authorized Signatory’s First Legal Name"
              value={currentUser.givenName}
              readOnly
            />
            <Form.Input
              label="Authorized Signatory’s Last Legal Name"
              value={currentUser.familyName}
              readOnly
            />
            <Form.Field>
              <Form.Input
                label={entityAccount.entityTitle.label}
                name={entityAccount.entityTitle.key}
                placeholder={entityAccount.entityTitle.placeHolder}
                value={entityAccount.entityTitle.value}
                error={!!entityAccount.entityTitle.error}
                onChange={this.handleInputChange}
              />
              <FieldError error={entityAccount.entityTitle.error} />
            </Form.Field>
          </div>
          <Grid divided="vertically">
            <Grid.Row>
              <Grid.Column width={7}>
                {/* eslint-disable jsx-a11y/label-has-for */}
                <label>
                  <h3>Upload a Photo ID</h3>
                  Driving Liscence or passport
                </label>
              </Grid.Column>
              <Grid.Column width={9}>
                {entityAccount.photoId.value === '' &&
                  <div className="file-uploader">
                    <Icon name="upload" /> Choose a file <span>or drag it here</span>
                    <input
                      name={entityAccount.photoId.key}
                      type="file"
                      onChange={this.uploadDocument}
                      accept=".jpg,.jpeg,.pdf"
                    />
                  </div>
                }
                {entityAccount.photoId.value !== '' &&
                <div className="file-uploader attached">
                    {entityAccount.photoId.value}
                  <Icon name="remove" onClick={this.removeUploadedPhotoId} />
                </div>
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>

          {/* <Form.Field>
            <label>
              <h3>Upload a Photo ID</h3>
              Driving Liscence or passport
            </label>
          </Form.Field> */}
        </Form>
      </div>
    );
  }
}
