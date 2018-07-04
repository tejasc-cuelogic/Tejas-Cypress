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
    const { formIdentity } = this.props.iraAccountStore;
    const { errors, confirmBox } = this.props.uiStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Confirm your identity and upload your <br /> Driver’s License, state-issued ID, or U.S. <br /> passport</Header>
        <Divider section hidden />
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Form className="file-uploader-large">
          <DropZoneLarge
            name="identityDoc"
            fielddata={formIdentity.fields.identityDoc}
            ondrop={this.onIdentityDocDrop}
            onremove={this.confirmRemoveDoc}
          />
        </Form>
        <Divider section hidden />
        <p className="center-align">As a regulated financial service company operating in the U.S., we are we are periodically required to identify users on the  platform. That’s why lorem ipsum dolor sit amet
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
