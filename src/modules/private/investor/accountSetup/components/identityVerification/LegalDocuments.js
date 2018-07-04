import React from 'react';
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
  <Modal size="tiny" open closeIcon onClose={() => close()}>
    <Modal.Header className="center-align signup-header">
      <Header as="h2">We need to confirm your identity</Header>
      <Divider />
      <p>
        Please upload two valid identity documents
      </p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      {inProgress && !submitVerificationsDocs &&
        <Dimmer active={inProgress}>
          <Loader active={inProgress} />
        </Dimmer>
      }
      {errors && errors.message &&
        <Message error textAlign="left">
          <ListErrors errors={[errors.message]} />
        </Message>
      }
      {errors && !errors.message &&
        <Message error textAlign="left">
          <ListErrors errors={[errors]} />
        </Message>
      }
      <Form onSubmit={onSubmit} className="file-uploader-inline">
        <Grid divided="vertically">
          <Grid.Row>
            <Grid.Column width={7}>
              {/* eslint-disable jsx-a11y/label-has-for */}
              <Header>
                Upload a Photo ID
                <Header.Subheader>Driving Liscence or passport</Header.Subheader>
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
              <label>
                <h3>Proof of Residence
                  <Popup className="test" trigger={<Icon className="ns-help-circle" />} position="top center" flowing hoverable>
                    <Popup.Content>
                      <p><b>Acceptable documents:</b></p>
                      <List bulleted>
                        <List.Item>Utility bill in your name for that address</List.Item>
                        <List.Item>
                          Signed lease (if an apartment) that shows the<br />
                          address (just the signature page)
                        </List.Item>
                        <List.Item>Voided check with your name  and address on it</List.Item>
                        <List.Item>A completed USPS mail forward form</List.Item>
                        <List.Item>DMV registration form</List.Item>
                      </List>
                    </Popup.Content>
                  </Popup>
                </h3>
                Utility Bill or USPS change of address format
              </label>
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
        <Divider section hidden />
        <div className="center-align">
          <Button loading={submitVerificationsDocs && inProgress} primary size="large" className="very relaxed" disabled={!form.meta.isValid}>Verify my identity</Button>
        </div>
        <div className="center-align">
          <Button type="button" className="cancel-link" onClick={() => close()}>I`ll finish this letter</Button>
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
  </Modal>
));

export default LegalDocuments;
