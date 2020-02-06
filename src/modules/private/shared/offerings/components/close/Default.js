import React, { useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Button, Header, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../theme/form';

export default inject('offeringCreationStore')(observer(({ offeringCreationStore, formChange, OFFERING_DEFAULT_FRM, inProgress, shorthandBusinessName, handleCloseModal, adminSetOfferingAsDefaulted }) => {
  const handleSubmit = () => {
    adminSetOfferingAsDefaulted().then(() => handleCloseModal());
  };

  useEffect(() => {
    offeringCreationStore.resetForm('OFFERING_DEFAULT_FRM');
    return () => {
      offeringCreationStore.resetForm('OFFERING_DEFAULT_FRM');
    };
  }, []);

  return (
    <div className="content">
      <Form className="mt-30">
        <Header as="h4">
        Default {shorthandBusinessName}
        </Header>
        <Divider hidden />
        <FormTextarea
          containerclassname="secondary"
          name="reason"
          fielddata={OFFERING_DEFAULT_FRM.fields.reason}
          changed={(e, result) => formChange(e, result, 'OFFERING_DEFAULT_FRM')}
        />
        <Divider hidden />
        <div className="action width-100 right-align">
        <Button.Group compact>
          <Button onClick={handleCloseModal} content="Cancel" />
          <Button disabled={!OFFERING_DEFAULT_FRM.meta.isValid} loading={inProgress} onClick={handleSubmit} primary content="Submit" />
        </Button.Group>
        </div>
      </Form>
    </div>
  );
}));
