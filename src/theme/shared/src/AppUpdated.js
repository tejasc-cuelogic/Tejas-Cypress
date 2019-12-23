import React from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

const AppUpdated = () => {
  const update = () => window.location.reload();
  return (
    <Modal dimmer open>
      <Modal.Header>
        <Icon name="lightbulb outline" color="green" />
        A new version of NextSeed application is available!
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p style={{ marginLeft: '26px' }}>Please refresh your browser to enjoy the latest version.</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          icon="checkmark"
          labelPosition="right"
          content="Refresh !"
          onClick={() => {
            update();
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AppUpdated;
