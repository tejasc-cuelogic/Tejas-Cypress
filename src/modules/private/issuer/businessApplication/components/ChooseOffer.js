import React, { Component } from 'react';
import { Modal, Header } from 'semantic-ui-react';

export default class ChangePassword extends Component {
  render() {
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Choose from Campaign Offers</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          content goes here...
        </Modal.Content>
      </Modal>
    );
  }
}
