import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Button } from 'semantic-ui-react';
import { FormInput } from '../../../../../../theme/form';

const FieldsForm = observer(({
  close, form, financesChange, chkboxTicked, handleFormSubmit, canSubmitFieldsForm, modalStatus,
}) => (
  <Modal size="mini" open={modalStatus} closeIcon onClose={close}>
    <Modal.Content className="signup-content">
      <Form onSubmit={handleFormSubmit}>
        <FormInput
          fielddata={chkboxTicked === 'checkbox1' ? form.fields.companyName : form.fields.firmName}
          name={chkboxTicked === 'checkbox1' ? 'companyName' : 'firmName'}
          changed={financesChange}
        />
        <Button.Group>
          <Button color="green" className="very relaxed" disabled={!canSubmitFieldsForm} >Submit</Button>
          <Button onClick={close}>Cancel</Button>
        </Button.Group>
      </Form>
    </Modal.Content>
  </Modal>
));

export default FieldsForm;
