import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Grid, Divider, Message, Confirm } from 'semantic-ui-react';
import { DropZone } from '../../../../theme/form';
import { ListErrors } from '../../../../theme/common';

@inject('uiStore', 'entityAccountStore')
@observer
export default class FormationDocumemts extends Component {
  onFormationDocDrop = (files) => {
    this.props.entityAccountStore.setFileUploadData('formFormationDocuments', 'formationDoc', files);
  }
  onOperatingAgreementDocDrop = (files) => {
    this.props.entityAccountStore.setFileUploadData('formFormationDocuments', 'operatingAgreementDoc', files);
  }
  onEinVerificationDocDrop = (files) => {
    this.props.entityAccountStore.setFileUploadData('formFormationDocuments', 'einVerificationDoc', files);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  confirmRemoveDoc = (e, name) => {
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelDoc = (field) => {
    this.props.entityAccountStore.removeUploadedData('formFormationDocuments', field, 'Formation doc');
    this.props.uiStore.setConfirmBox('');
  }
  render() {
    const { formFormationDocuments } = this.props.entityAccountStore;
    const { errors, confirmBox } = this.props.uiStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Upload required documentation</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Header>
        <Divider hidden />
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Form className="file-uploader-inline">
          <Grid verticalAlign="middle" divided="vertically">
            <Grid.Row>
              <Grid.Column width={7}>
                <Header as="h3">Entity Formation Document</Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <DropZone
                  name="formationDoc"
                  fielddata={formFormationDocuments.fields.formationDoc}
                  ondrop={this.onFormationDocDrop}
                  onremove={this.confirmRemoveDoc}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={7}>
                <Header as="h3">Entity Operating Document</Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <DropZone
                  name="operatingAgreementDoc"
                  fielddata={formFormationDocuments.fields.operatingAgreementDoc}
                  ondrop={this.onOperatingAgreementDocDrop}
                  onremove={this.confirmRemoveDoc}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={7}>
                <Header as="h3">EIN Verification</Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <DropZone
                  name="einVerificationDoc"
                  fielddata={formFormationDocuments.fields.einVerificationDoc}
                  ondrop={this.onEinVerificationDocDrop}
                  onremove={this.confirmRemoveDoc}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'einVerificationDoc' || confirmBox.entity === 'operatingAgreementDoc' || confirmBox.entity === 'formationDoc'}
          onCancel={this.handleDelCancel}
          onConfirm={() => this.handleDelDoc(confirmBox.entity)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
