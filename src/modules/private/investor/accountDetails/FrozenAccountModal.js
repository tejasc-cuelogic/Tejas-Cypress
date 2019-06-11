/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Modal, Divider, Button, Header } from 'semantic-ui-react';

const FrozenAccountModal = props => (
  <Modal
    open
    closeIcon
    onClose={() => props.handleClose()}
  >
    <Modal.Content className="center-align mt-30">
      <Header as="h3" textAlign="center">This investment account is frozen.</Header>
      <p>
        Please contact
        {' '}
        <a href="mailto:support@nextseed.com">support@nextseed.com</a>
&nbsp;
        for further information.
      </p>
      <Divider hidden />
      <div className="mt-30"><Button onClick={() => props.handleClose()} primary className="relaxed" content="Back to Account Details" /></div>
      <Divider hidden />
    </Modal.Content>
  </Modal>
);
export default FrozenAccountModal;
