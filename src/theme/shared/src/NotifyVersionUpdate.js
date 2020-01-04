import React from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

const NotifyVersionUpdate = () => {
  const update = () => window.location.reload();
  return (
    <Modal dimmer open>
      <Modal.Header>
        <Icon name="sync alternate" color="green" />
        Let{"'"}s Refresh
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <h5 style={{ marginLeft: '27px', fontWeight: 'normal' }}>
            There is new update of this website available.<br />
            and you will need to reload your browser to see the latest.
          </h5>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button positive content="Refresh !" onClick={update} />
      </Modal.Actions>
    </Modal>
  );
};

export default NotifyVersionUpdate;
