import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Message, Confirm } from 'semantic-ui-react';
import { DropZone } from '../../../../../../../theme/form';
import { ListErrors } from '../../../../../../../theme/shared';

@inject('uiStore', 'entityAccountStore')
@observer
export default class FormationDocumemts extends Component {
  onFormationDocDrop = (files) => {
    this.props.entityAccountStore.setFileUploadData('FORM_DOCS_FRM', 'formationDoc', files);
  }
  onOperatingAgreementDocDrop = (files) => {
    this.props.entityAccountStore.setFileUploadData('FORM_DOCS_FRM', 'operatingAgreementDoc', files);
  }
  onEinVerificationDocDrop = (files) => {
    this.props.entityAccountStore.setFileUploadData('FORM_DOCS_FRM', 'einVerificationDoc', files);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  confirmRemoveDoc = (e, name) => {
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelDoc = (field) => {
    this.props.entityAccountStore.removeUploadedData('FORM_DOCS_FRM', field, 'Formation doc');
    this.props.uiStore.setConfirmBox('');
  }
  render() {
    const { FORM_DOCS_FRM } = this.props.entityAccountStore;
    const { errors, confirmBox } = this.props.uiStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Upload required documentation</Header>
        <Divider hidden />
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Form>
          <DropZone
            name="formationDoc"
            fielddata={FORM_DOCS_FRM.fields.formationDoc}
            ondrop={this.onFormationDocDrop}
            onremove={this.confirmRemoveDoc}
            containerclassname="fluid"
            uploadtitle="Choose a file or drag it here"
          />
          <DropZone
            name="operatingAgreementDoc"
            fielddata={FORM_DOCS_FRM.fields.operatingAgreementDoc}
            ondrop={this.onOperatingAgreementDocDrop}
            onremove={this.confirmRemoveDoc}
            containerclassname="fluid"
            uploadtitle="Choose a file or drag it here"
          />
          <DropZone
            name="einVerificationDoc"
            fielddata={FORM_DOCS_FRM.fields.einVerificationDoc}
            ondrop={this.onEinVerificationDocDrop}
            onremove={this.confirmRemoveDoc}
            containerclassname="fluid"
            uploadtitle="Choose a file or drag it here"
          />
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
