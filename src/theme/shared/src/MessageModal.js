import React, { Component } from 'react';
import { Modal, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

@withRouter
export default class MessageModal extends Component {
  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }

  render() {
    const { content, additionalData, classExtra, size, handleBack } = this.props;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={handleBack || this.handleBack} size={size || 'mini'}>
        <Modal.Content>
          <Header as="h3" className={`success-msg center-align mb-60 mt-50 ${classExtra}`}>
            <br />
              {content || 'This feature is currently unavailable.'}
          </Header>
          {additionalData}
        </Modal.Content>
      </Modal>
    );
  }
}
