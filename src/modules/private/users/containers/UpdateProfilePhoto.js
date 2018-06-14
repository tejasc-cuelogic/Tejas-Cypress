import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Modal, Form } from 'semantic-ui-react';
import { DropZoneLarge } from '../../../../theme/form/FormElements';

@inject('profileStore')
@withRouter
@observer
export default class UpdateProfilePhoto extends Component {
  onProfilePhotoDrop = () => {
    console.log('in onProfilePhotoDrop');
  }
  confirmRemoveDoc = () => {
    console.log('in confirmRemoveDoc');
  }
  handleCloseModal = () => {
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    }
  }
  render() {
    const { profilePhoto } = this.props.profileStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>Default Profile Image</Header>
            <Form className="file-uploader-large">
              <DropZoneLarge
                name="identityDoc"
                fielddata={profilePhoto}
                ondrop={this.onProfilePhotoDrop}
                onremove={this.confirmRemoveDoc}
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}
