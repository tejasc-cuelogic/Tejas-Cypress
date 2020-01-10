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
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.props.handleBack || this.handleBack} size={this.props.size || 'mini'}>
        <Modal.Content>
          <Header as="h3" className="success-msg center-align mb-60 mt-50">
            <br />
              {this.props.content || 'This feature is currently unavailable.'}
          </Header>
        </Modal.Content>
      </Modal>
    );
  }
}
