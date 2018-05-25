import React, { Component } from 'react';
import { Header, Form, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { FormInput, FileUploader } from '../../../../theme/form/FormElements';

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
              name="title"
              fielddata={formPersonalInfo.fields.title}
              changed={personalInfoChange}
            />
          </div>
          <Grid>
            <FileUploader
              name="legalDocUrl"
              fielddata={formPersonalInfo.fields.legalDocUrl}
              uploadDocument={personalInfoFileUpload}
              removeUploadedDocument={personalInfoResetField}
            />
          </Grid>
        </Form>
      </div>
    );
  }
}
