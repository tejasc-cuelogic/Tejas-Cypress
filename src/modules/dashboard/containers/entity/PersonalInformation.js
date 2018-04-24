import React, { Component } from 'react';
import { Header, Form, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import FormInput from '../../../../components/form/FormInput';
import { FileUploader } from '../../../../components/form/FormElements';

@inject('userStore', 'entityAccountStore')
@observer
export default class PersonalInformation extends Component {
  render() {
    const {
      formPersonalInfo,
      personalInfoChange,
      personalInfoFileUpload,
      personalInfoResetField,
    } = this.props.entityAccountStore;
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
              className="readonly"
              readOnly
            />
            <Form.Input
              label="Authorized Signatory’s Last Legal Name"
              value={currentUser.familyName}
              className="readonly"
              readOnly
            />
            <FormInput
              name="entityTitle"
              fielddata={formPersonalInfo.fields.entityTitle}
              changed={personalInfoChange}
            />
          </div>
          <Grid>
            <FileUploader
              name="photoId"
              fielddata={formPersonalInfo.fields.photoId}
              uploadDocument={personalInfoFileUpload}
              removeUploadedDocument={personalInfoResetField}
            />
          </Grid>
        </Form>
      </div>
    );
  }
}
