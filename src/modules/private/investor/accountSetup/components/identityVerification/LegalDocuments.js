/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Modal, Button, Header, Form, Divider, Message, Confirm, Dimmer, Loader, List, Grid } from 'semantic-ui-react';

import { ListErrors } from '../../../../../../theme/shared';
import { DropZone } from '../../../../../../theme/form';

const LegalDocuments = observer(({
  form,
  close,
  errors,
  confirmBox,
  inProgress,
  onPhotoIdDrop,
  onProofOfResidenceDrop,
  confirmRemoveDoc,
  handleDelCancel,
  handleDelDoc,
  submitVerificationsDocs,
  onSubmit,
}) => (
  <Modal size="tiny" open closeIcon onClose={close} closeOnDimmerClick={false}>
    <Modal.Header className="center-align signup-header">
      <Header as="h3">Verify your identity</Header>
      <Divider section />
      <p>
      Unfortunately, we were still unable to verify your identity based on the information entered.
      To complete identity verification,
      we’ll need a copy of a valid photo ID and proof of residence.
      </p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      {inProgress && !submitVerificationsDocs &&
        <Dimmer active={inProgress}>
          <Loader active={inProgress} />
        </Dimmer>
      }
      <Form error onSubmit={onSubmit} className="file-uploader-inline">
        <Form.Field className="mb-30">
          <label className="mb-half">Upload a Photo ID (Drivers License or Passport)</label>
          <DropZone
            name="photoId"
            fielddata={form.fields.photoId}
            ondrop={onPhotoIdDrop}
            onremove={confirmRemoveDoc}
            containerclassname="fluid"
          />
        </Form.Field>
        <Form.Field>
          <label className="mb-20">Proof of Residence</label>
          <div className="more-info">
            <p>Provide one of the acceptable documents:</p>
            <Grid>
              <Grid.Column width={8}>
                <List bulleted>
                  <List.Item>Utility bill in your name</List.Item>
                  <List.Item>Completed USPS mail forward form</List.Item>
                  <List.Item>DMV registration form</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={8}>
                <List bulleted>
                  <List.Item>Signed lease (including address and signature page)</List.Item>
                  <List.Item>Voided check with your name and address</List.Item>
                </List>
              </Grid.Column>
            </Grid>
          </div>
          <Divider hidden />
          <DropZone
            name="proofOfResidence"
            fielddata={form.fields.proofOfResidence}
            ondrop={onProofOfResidenceDrop}
            onremove={confirmRemoveDoc}
            containerclassname="fluid"
          />
        </Form.Field>
        {errors &&
          <Message error textAlign="left" className="mt-30">
            <ListErrors errors={errors.message ? [errors.message] : [errors]} />
          </Message>
        }
        <div className="center-align mt-30">
          <Button primary size="large" className="very relaxed" content="Verify my identity" loading={submitVerificationsDocs && inProgress} disabled={!form.meta.isValid} />
        </div>
      </Form>
      <Confirm
        header="Confirm"
        content="Are you sure you want to remove this file?"
        open={confirmBox.entity === 'proofOfResidence' || confirmBox.entity === 'photoId'}
        onCancel={handleDelCancel}
        onConfirm={() => handleDelDoc(confirmBox.entity)}
        size="mini"
        className="deletion"
      />
    </Modal.Content>
    <Modal.Actions className="signup-actions">
      <p><Link to="/app/summary">I’ll finish this later</Link></p>
    </Modal.Actions>
  </Modal>
));

export default LegalDocuments;
