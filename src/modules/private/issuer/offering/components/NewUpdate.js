import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';

export default class NewUpdate extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
  };

  render() {
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          New Update
        </Modal.Content>
      </Modal>
    );
  }
}
