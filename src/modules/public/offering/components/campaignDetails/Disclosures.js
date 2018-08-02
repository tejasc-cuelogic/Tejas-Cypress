import React, { Component } from 'react';
import { Header, Modal } from 'semantic-ui-react';

class Disclosures extends Component {
  render() {
    return (
      <Modal
        open
        onClose={this.props.history.goBack}
        closeIcon
        size="large"
      >
        <Header as="h3">
        Disclosures
        </Header>
        <Modal.Content scrolling />
      </Modal>
    );
  }
}

export default Disclosures;
