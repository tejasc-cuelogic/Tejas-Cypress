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
        <Header as="h4" textAlign="center">Enter the Authorized Signatory Information</Header>
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
          <Grid verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={7}>
                <Header as="h3">
                  Upload a Photo ID
                  <Header.Subheader>Drivers License or Passport</Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <FileUploader
                  name="legalDocUrl"
                  fielddata={formPersonalInfo.fields.legalDocUrl}
                  uploadDocument={personalInfoFileUpload}
                  removeUploadedDocument={personalInfoResetField}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </div>
    );
  }
}
