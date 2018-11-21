import React, { Component } from 'react';
import { Header, Form, Grid, Message, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { ListErrors } from '../../../../../../../theme/shared';
import { FormInput, DropZone } from '../../../../../../../theme/form';

@inject('uiStore', 'userStore', 'entityAccountStore')
@observer
export default class PersonalInformation extends Component {
  onLegalDocUrlDrop = (files) => {
    this.props.entityAccountStore.setFileUploadData('PERSONAL_INFO_FRM', 'legalDocUrl', files);
  }
  confirmRemoveDoc = (e, name) => {
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelLegalDocUrl = () => {
    this.props.entityAccountStore.removeUploadedData('PERSONAL_INFO_FRM', 'legalDocUrl', 'Personal info');
    this.props.uiStore.setConfirmBox('');
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  render() {
    const {
      PERSONAL_INFO_FRM,
      personalInfoChange,
    } = this.props.entityAccountStore;
    const { currentUser } = this.props.userStore;
    const { errors, confirmBox } = this.props.uiStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Authorized Signatory Informaiton</Header>
        <p className="center-align">Please provide your title and a copy of your photo ID.</p>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Form error>
          <div className="field-wrap">
            <Form.Group widths="equal">
              <Form.Input
                label="First Name (Legal)"
                value={currentUser.givenName}
                className="readonly"
                readOnly
              />
              <Form.Input
                label="Last Name (Legal)"
                value={currentUser.familyName}
                className="readonly"
                readOnly
              />
            </Form.Group>
            <FormInput
              name="title"
              fielddata={PERSONAL_INFO_FRM.fields.title}
              changed={personalInfoChange}
              showerror
            />
          </div>
          <Grid verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <DropZone
                  name="legalDocUrl"
                  fielddata={PERSONAL_INFO_FRM.fields.legalDocUrl}
                  ondrop={this.onLegalDocUrlDrop}
                  onremove={this.confirmRemoveDoc}
                  uploadtitle="Choose a file or drag it here"
                  containerclassname="fluid"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'legalDocUrl'}
          onCancel={this.handleDelCancel}
          onConfirm={this.handleDelLegalDocUrl}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
