import React, { Component } from 'react';
import { Header, Form, Input, Icon } from 'semantic-ui-react';
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
        <Header as="h2">Complete personal info about entity</Header>
        {currentUser.givenName}
        {currentUser.familyName}
        <Form error>
          <Form.Field>
            { /*  eslint-disable jsx-a11y/label-has-for */ }
            <label>
              {entityAccount.entityTitle.label}
            </label>
            <Input
              name={entityAccount.entityTitle.key}
              placeholder={entityAccount.entityTitle.placeHolder}
              value={entityAccount.entityTitle.value}
              error={!!entityAccount.entityTitle.error}
              onChange={this.handleInputChange}
            />
            <FieldError error={entityAccount.entityTitle.error} />
          </Form.Field>
          <Form.Field>
            <label>
              <h3>Upload a Photo ID</h3>
              Driving Liscence or passport
            </label>
            {entityAccount.photoId.value === '' &&
              <div className="file-uploader">
                <Icon name="upload" /> Choose a file <span>or drag it here</span>
                <input
                  name={entityAccount.photoId.key}
                  type="file"
                  onChange={this.uploadDocument}
                />
              </div>
            }
            {entityAccount.photoId.value !== '' &&
            <div className="file-uploader attached">
                {entityAccount.photoId.value}
              <Icon name="remove" onClick={this.removeUploadedPhotoId} />
            </div>
            }
          </Form.Field>
        </Form>
      </div>
    );
  }
}
