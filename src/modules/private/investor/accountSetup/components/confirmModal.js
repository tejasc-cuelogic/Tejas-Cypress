/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Modal, Header, Divider, Button } from 'semantic-ui-react';

const ConfirmModal = props => (
  <Modal open={props.open} onClose={props.handleCloseModal} size="mini" closeIcon>
    <Modal.Content className="center-align mt-30">
      <Header as="h3">Thank you for creating an account with NextSeed</Header>
      <p className="mt-30 mb-30">
        {props.content}
      </p>
      <Divider hidden />
      <Button onClick={props.HandleModalCta} primary size="large">Explore Campaigns</Button>
      <Divider hidden />
    </Modal.Content>
  </Modal>
);

export default ConfirmModal;
