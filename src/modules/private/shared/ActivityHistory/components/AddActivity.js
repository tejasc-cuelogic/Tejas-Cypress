import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Icon, Modal } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';
// import { FormInput } from '../../../../../theme/form';

const AddActivity = observer((props) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (showModal) {
      Helper.modalCssUpdate('show-top', 'show-top');
    }
  }, [showModal]);
  return (
    <>
      <Form error onSubmit={props.submit} className="comment-input history">
        {props.smartElement.Input('comment', { ishidelabel: 'true' })}
        <div className="attachment">
          <Icon className="ns-attachment" color="grey" size="large" disabled={!props.stepName} onClick={() => setShowModal(!showModal)} />
        </div>
        <Button disabled={!props.form.meta.isValid} icon type="submit" basic>
          <Icon className="ns-send-right" color="blue" size="large" />
        </Button>
      </Form>
      <Modal open={showModal} closeOnDimmerClick={false} size="small" className="show-top" closeIcon onClose={() => setShowModal(!showModal)}>
        <Modal.Header>Add Activity</Modal.Header>
        <Modal.Content>
          <Form>
            {props.smartElement.Input('comment', { label: 'Comment' })}
            <Form.Field className="mt-30">
              {props.smartElement.DropZone('documents', { stepName: props.stepName, investorId: props.investorId, offeringId: props.offeringId, applicationIssuerId: props.applicationIssuerId, applicationId: props.applicationId })}
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions textAlign="right">
          <Button className="relaxed" disabled={!props.form.meta.isValid} onClick={() => { props.submit(); setShowModal(false); }} icon type="submit" content="Submit" primary />
        </Modal.Actions>
      </Modal>
    </>
  );
});

export default AddActivity;
