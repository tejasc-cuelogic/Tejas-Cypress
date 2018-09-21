import React, { Component } from 'react';
import { Modal, Header } from 'semantic-ui-react';

export default class AddNewTier extends Component {
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }
  render() {
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Add new tier</Header>
        </Modal.Header>
      </Modal>
    );
  }
}
