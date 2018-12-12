/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
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
      <Aux>
        <Header as="h3" textAlign="center">Confirm your identity</Header>
        <Divider section hidden />
        <Form className="file-uploader-large">
          <div className="field">
            <label className="center-align">Upload a Photo ID (Upload your Driver’s License, state-issued ID, or U.S. passport)</label>
          </div>
          <DropZoneLarge
            name="identityDoc"
            fielddata={IDENTITY_FRM.fields.identityDoc}
            ondrop={this.onIdentityDocDrop}
            onremove={this.confirmRemoveDoc}
          />
        </Form>
        {errors &&
          <Message error className="mt-30">
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Divider section hidden />
        <p className="center-align grey-header mt-30">NextSeed is a regulated financial services company operating in the US. To comply with KYC/AML regulations, we need to verify your identity in order to set up your account.</p>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'identityDoc'}
          onCancel={this.handleDelCancel}
          onConfirm={this.onIdentityDocRemove}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
