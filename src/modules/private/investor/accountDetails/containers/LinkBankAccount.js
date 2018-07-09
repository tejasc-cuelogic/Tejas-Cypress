import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { Plaid } from '../../../shared/bankAccount';

export default class LinkBankAccount extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="small" closeOnDimmerClick={false}>
        <Modal.Content className="relaxed">
          <Plaid />
        </Modal.Content>
      </Modal>
    );
  }
}
