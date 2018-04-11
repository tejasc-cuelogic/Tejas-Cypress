import React from 'react';
import { Modal, Button, Header, Divider } from 'semantic-ui-react';

const selectQuestionsOrEditInformation = props => (
  <Modal size="mini" dimmer="blurring" open closeIcon onClose={() => props.setDashboardWizardStep()}>
    <Modal.Header className="center-align signup-header">
      <Header as="h2">There was a problem with verifying your identity</Header>
      <Divider />
      <p>
        You can either choose answer challege questions or go back and
        correct the submitted information.
      </p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <div className="center-align">
        <Button color="green" size="large" onClick={() => props.setDashboardWizardStep('ConfirmIdentityForm')}>Answer challenge questions</Button>
      </div>
      <div className="center-align">
        <Button className="cancel-link" onClick={() => props.setDashboardWizardStep('InvestorPersonalDetails')}>Correct Information</Button>
      </div>
    </Modal.Content>
  </Modal>
);

export default selectQuestionsOrEditInformation;
