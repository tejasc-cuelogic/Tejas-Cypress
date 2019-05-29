import React from 'react';
import { Modal, Button, Header, Icon } from 'semantic-ui-react';

const SuccessScreen = ({ successMsg, handleContinue }) => (
  <Modal size="mini" open>
    <Modal.Content>
      <Header as="h3" className="success-msg center-align mb-60 mt-50">
        <Icon className="ns-check-circle" color="green" size="huge" />
        <br />
        {successMsg}
      </Header>
      <div className="center-align mt-30">
        <Button primary size="large" className="very relaxed" onClick={handleContinue} content="Continue" />
      </div>
    </Modal.Content>
  </Modal>
);

export default SuccessScreen;
