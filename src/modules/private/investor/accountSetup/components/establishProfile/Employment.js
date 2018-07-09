import React from 'react';
import { Modal } from 'semantic-ui-react';

const Employment = ({
  close,
}) => (
  <Modal size="mini" open closeIcon onClose={close}>
    <Modal.Header className="center-align signup-header">
      <p>
        Federal regulations require us to verify your legal<br />
        identity. We use state-of-the-art security measures<br /> to protect your information.
      </p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <p>Establish Investor Profile - Employment..</p>
    </Modal.Content>
  </Modal>
);

export default Employment;
