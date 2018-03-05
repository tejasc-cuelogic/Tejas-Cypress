import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

const investmentChooseType = props => (
  <Modal size="tiny" open>
    <Modal.Header>
      What type of investment account would you like to start?
    </Modal.Header>
    <Modal.Content>
      <div>Individual</div>
      <div>Entity</div>
      <div>IRA</div>
      {props.authWizardStep}
    </Modal.Content>
    <Modal.Actions>
      <Button positive icon="checkmark" labelPosition="right" content="Accept" />
    </Modal.Actions>
  </Modal>
);

export default investmentChooseType;
