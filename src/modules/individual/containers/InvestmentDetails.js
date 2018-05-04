import React, { Component } from 'react';
import { Modal, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('uiStore')
@observer
class InvestmentDetails extends Component {
  handleCloseModal = () => {
    this.props.uiStore.setModalStatus(false);
  }
  render() {
    return (
      <Modal closeIcon size="mini" open={this.props.uiStore.modalStatus === 'InvestmentDetails'} onClose={this.handleCloseModal}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">
           Investment details
          </Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          Modal content
        </Modal.Content>
      </Modal>
    );
  }
}

export default InvestmentDetails;
