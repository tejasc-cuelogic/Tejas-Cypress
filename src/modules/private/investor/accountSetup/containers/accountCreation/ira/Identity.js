import React, { Component } from 'react';
import { Header, Form, Divider, Message, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { DropZoneLarge } from '../../../../../../../theme/form';
import { ListErrors } from '../../../../../../../theme/shared';

@inject('uiStore', 'iraAccountStore')
@observer
export default class Identity extends Component {
  onIdentityDocDrop = (files) => {
    this.props.iraAccountStore.setFileUploadData('identityDoc', files);
  }
  onIdentityDocRemove = () => {
    this.props.iraAccountStore.removeUploadedData('identityDoc');
    this.props.uiStore.setConfirmBox('');
  }
  confirmRemoveDoc = (name) => {
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  render() {
    const { IDENTITY_FRM } = this.props.iraAccountStore;
    const { errors, confirmBox } = this.props.uiStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Confirm your identity</Header>
        <Divider section hidden />
        <p className="center-align grey-header">
          <b>Upload a Photo ID (Upload your Driver’s License, state-issued ID, or U.S. passport)</b>
        </p>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Form className="file-uploader-large">
          <DropZoneLarge
            name="identityDoc"
            fielddata={IDENTITY_FRM.fields.identityDoc}
            ondrop={this.onIdentityDocDrop}
            onremove={this.confirmRemoveDoc}
          />
        </Form>
        <Divider section hidden />
        <p className="center-align grey-header">NextSeed is a regulated financial services company operating in the US. To comply with KYC/AML regulations, we need to verify your identity in order to set up your account.
        </p>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'identityDoc'}
          onCancel={this.handleDelCancel}
          onConfirm={this.onIdentityDocRemove}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
