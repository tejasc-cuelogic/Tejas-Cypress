import React from 'react';
import { Modal, Header, Divider, Icon } from 'semantic-ui-react';

const ThanksNote = props => (
  <Modal open closeIcon onClose={props.closeModal} size="tiny" closeOnDimmerClick={false}>
    <Modal.Header className="center-align signup-header">
      <Icon.Group size="huge">
        <Icon className="ns-document" />
        <Icon corner color="orange" className="ns-reload-circle" />
      </Icon.Group>
      <Header as="h3">Thank you! We are verifying your request</Header>
      <Divider />
    </Modal.Header>
    <Modal.Content className="center-align">
    We are processing your Accreditation request and we will <br />notify you about status changes.
    </Modal.Content>
  </Modal>
);

export default ThanksNote;
