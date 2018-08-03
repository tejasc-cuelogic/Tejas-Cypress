import React from 'react';
import { Modal, Header, Divider, Icon } from 'semantic-ui-react';

const ThanksNote = props => (
  <Modal open closeIcon onClose={props.closeModal} size="tiny" closeOnDimmerClick={false}>
    {/* <Modal.Header className="center-align signup-header">
    </Modal.Header> */}
    <Modal.Content className="center-align">
      <Header as="h2">
        <Icon.Group>
          <Icon className="ns-document" />
          <Icon corner color="orange" className="ns-reload-circle" />
        </Icon.Group>
      </Header>
      <Divider hidden />
      <Header as="h3">Thank you! We are verifying your request</Header>
      <Divider hidden />
      <p>
        We are processing your Accreditation request and we will notify you about status changes.
      </p>
    </Modal.Content>
  </Modal>
);

export default ThanksNote;
