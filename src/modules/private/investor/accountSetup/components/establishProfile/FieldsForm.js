import React from 'react';
import { observer } from 'mobx-react';
import { Modal } from 'semantic-ui-react';

const FieldsForm = observer(({
  close,
}) => (
  <Modal size="mini" open closeIcon onClose={close}>
    <Modal.Header className="center-align signup-header">
      <p>
        Fields form for finances
      </p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <p>Fields Form</p>
    </Modal.Content>
  </Modal>
));

export default FieldsForm;
