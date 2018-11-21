import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Modal, Button, Header, Form, Divider, Popup, Icon, Grid, List, Message, Confirm, Dimmer, Loader } from 'semantic-ui-react';

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
      {errors &&
        <Message error textAlign="left">
          <ListErrors errors={errors.message ? [errors.message] : [errors]} />
        </Message>
      }
      <Form onSubmit={onSubmit} className="file-uploader-inline">
        <Grid divided="vertically">
          <Grid.Row>
            <Grid.Column width={7}>
              <Header as="h5">
                Upload a Photo ID
                <Header.Subheader>Driving License or passport</Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column width={9}>
              <DropZone
                name="photoId"
                fielddata={form.fields.photoId}
                ondrop={onPhotoIdDrop}
                onremove={confirmRemoveDoc}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={7}>
              <Header as="h5">Proof of Residence
                <Popup className="test" trigger={<Icon className="ns-help-circle" />} position="top center" flowing hoverable>
                  <Popup.Content>
                    <p><b>Acceptable documents:</b></p>
                    <List bulleted>
                      <List.Item>Utility bill in your name for that address</List.Item>
                      <List.Item>
                        Signed lease (if an apartment) that shows the
                        address (just the signature page)
                      </List.Item>
                      <List.Item>Voided check with your name  and address on it</List.Item>
                      <List.Item>A completed USPS mail forward form</List.Item>
                      <List.Item>DMV registration form</List.Item>
                    </List>
                  </Popup.Content>
                </Popup>
                <Header.Subheader>Utility Bill or USPS change of address format</Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column width={9}>
              <DropZone
                name="proofOfResidence"
                fielddata={form.fields.proofOfResidence}
                ondrop={onProofOfResidenceDrop}
                onremove={confirmRemoveDoc}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="center-align mt-30">
          <Button primary size="large" className="very relaxed" content="Verify my identity" loading={submitVerificationsDocs && inProgress} disabled={!form.meta.isValid} />
          {/* <Button.Group vertical>
            <Button type="button" className="link-button cancel-link"
            onClick={() => close()}>I`ll finish this later</Button>
          </Button.Group> */}
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
