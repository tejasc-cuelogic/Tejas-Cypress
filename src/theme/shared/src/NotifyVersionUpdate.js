import React from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

const NotifyVersionUpdate = (props) => {
  const update = () => {
    props.setAppUpdated(false);
    window.location.reload();
  };
  return (
    <Modal dimmer open size="tiny">
      <Modal.Content>
        <Modal.Description style={{ textAlign: 'center', margin: '37px 0 19px 0' }}>
          <Icon name="sync alternate" size="huge" />
          <h2>Let{"'"}s Refresh</h2>
          <h5 style={{ fontWeight: 'normal' }}>
            There{"'"}s a new version of this website available.<br />
            Please reload your browser to see the latest version.
          </h5>
          <br />
          <Button positive content="Refresh" onClick={update} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default NotifyVersionUpdate;