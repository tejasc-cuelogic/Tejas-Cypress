import React, { Component } from 'react';
import { Modal, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

@withRouter
export default class MessageModal extends Component {
  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }
  render() {
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Content>
          <Header as="h3" className="success-msg center-align mb-60 mt-50">
            <br />
                This feature is currently unavailable.
          </Header>
        </Modal.Content>
      </Modal>
    );
  }
}
