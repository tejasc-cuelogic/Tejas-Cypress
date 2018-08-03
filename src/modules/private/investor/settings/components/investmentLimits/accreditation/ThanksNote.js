import React from 'react';
import { Modal, Header, Divider, Icon } from 'semantic-ui-react';

const ThanksNote = props => (
  <Modal open closeIcon onClose={props.closeModal} size="mini" closeOnDimmerClick={false}>
    <Modal.Header className="center-align signup-header">
      <Header as="h2">
        <Icon.Group>
          <Icon className="ns-document" />
          <Icon corner color="orange" className="ns-reload-circle" />
        </Icon.Group>
      </Header>
      <Header as="h3">Thank you! We are verifying your request</Header>
      <Divider section />
      <p>
        We are processing your Accreditation request and we will notify you about status changes.
      </p>
      <Divider hidden />
    </Modal.Header>
  </Modal>
);

export default ThanksNote;
