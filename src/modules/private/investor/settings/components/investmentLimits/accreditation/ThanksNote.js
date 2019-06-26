import React from 'react';
import { Modal, Header, Divider, Icon } from 'semantic-ui-react';

const ThanksNote = props => (
  <Modal open closeIcon onClose={props.closeModal} size="mini">
    <Modal.Header className="center-align signup-header">
      <Header as="h2">
        <Icon.Group>
          <Icon className="ns-document" />
          <Icon corner color="orange" className="ns-reload-circle" />
        </Icon.Group>
      </Header>
      <Header as="h3">Thank you! <br />Your request was received.</Header>
      <Divider section />
      <p>
        We are processing your request and we will notify you about status changes.
      </p>
    </Modal.Header>
    {/* <div className="center-align">
      <Button onClick={props.closeModal} primary size="large">Close</Button>
    </div> */}
    <Divider hidden />
  </Modal>
);

export default ThanksNote;
