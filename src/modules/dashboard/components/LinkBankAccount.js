import React from 'react';
import { Modal, Button, Header, Divider } from 'semantic-ui-react';

const LinkBankAccount = props => (
  <Modal size="tiny" open closeIcon onClose={() => props.setDashboardWizardStep()}>
    <Modal.Header className="center-align signup-header">
      <Header as="h2">
        Link Bank Account
      </Header>
      <Divider />
    </Modal.Header>
    <Modal.Content className="signup-content">
      <div className="center-align">
        <Button circular color="green" size="large" >Answer challenge questions</Button>
      </div>
      <div className="center-align">
        <Button className="cancel-link" >Correct Information</Button>
      </div>
    </Modal.Content>
  </Modal>
);

export default LinkBankAccount;
