import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

const signupInitial = props => (
  <Modal size="tiny" open>
    <Modal.Header>
      How can NextSeed Help you?
    </Modal.Header>
    <Modal.Content>
      <div>Invester</div>
      <div>Business</div>
    </Modal.Content>
    <Modal.Actions>
      <Button positive icon="checkmark" onClick={() => props.setAuthWizardStep('InvestmentChooseType')} labelPosition="right" content="Start" />
    </Modal.Actions>
  </Modal>
);

export default signupInitial;
