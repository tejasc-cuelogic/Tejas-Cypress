/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Modal, Header, Divider, Button } from 'semantic-ui-react';

const GsProcessingModal = props => (
  <Modal open={props.open} size="mini">
    <Modal.Content className="center-align mt-30">
      <Header as="h3">Processing</Header>
      <p className="mt-30 mb-30">
        Thank you for submitting your account request. We have a little more to do
        on our end, and we'll notify you when your account is ready to use.
      </p>
      <Divider hidden />
      <Button onClick={props.closeModal} primary size="large">Continue</Button>
      <Divider hidden />
    </Modal.Content>
  </Modal>
);

export default GsProcessingModal;
