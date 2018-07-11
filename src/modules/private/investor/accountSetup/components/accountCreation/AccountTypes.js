import React from 'react';
import { Modal, Grid, Button, Header, Form } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../../../../theme/form';
import AccTypeDescription from './AccTypeDescription';

const AccountTypes = ({
  form,
  close,
  renderAccType,
  handleAccTypeChange,
}) => (
  <Modal open closeIcon onClose={close}>
    <Modal.Header className="center-align signup-header">
      <Header as="h1">What type of Investment Account would you like to start?</Header>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <Header as="h4" textAlign="center">Choose an account type</Header>
      <Grid textAlign="center">
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={form.fields.accType}
            name="accType"
            changed={handleAccTypeChange}
            containerclassname="button-radio center-align"
          />
          <AccTypeDescription
            accTypes={form.fields.accType}
          />
        </Form>
      </Grid>
      <Button
        circular
        icon={{ className: 'ns-arrow-right' }}
        className="multistep__btn next active"
        onClick={() => renderAccType()}
      />
    </Modal.Content>
  </Modal>
);

export default AccountTypes;
