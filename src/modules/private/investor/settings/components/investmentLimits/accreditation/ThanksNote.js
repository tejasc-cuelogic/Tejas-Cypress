import React from 'react';
import { Modal, Header, Divider } from 'semantic-ui-react';

const ThanksNote = props => (
  <Modal open closeIcon onClose={props.closeModal} size="tiny" closeOnDimmerClick={false}>
    <Modal.Header className="center-align signup-header">
      <Header as="h3">Thank you! We are verifying your request</Header>
      <Divider />
    </Modal.Header>
    <Modal.Content>
    We are processing your Accreditation request and we will <br />notify you about status changes.
    </Modal.Content>
  </Modal>
);

export default ThanksNote;
