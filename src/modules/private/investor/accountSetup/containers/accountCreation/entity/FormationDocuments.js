import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Message, Confirm, Button } from 'semantic-ui-react';
import { DropZone } from '../../../../../../../theme/form';
import { ListErrors } from '../../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

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


  handleContinueButton = () => {
    const { createAccount, stepToBeRendered } = this.props.entityAccountStore;
    const { multiSteps } = this.props.uiStore;
    createAccount(multiSteps[stepToBeRendered]);
  }

  render() {
    const { FORM_DOCS_FRM } = this.props.entityAccountStore;
    const { errors, confirmBox } = this.props.uiStore;
    return (
      <>
      <Header as="h4" textAlign={isMobile ? '' : 'center'}>Upload required documentation</Header>
        <Divider hidden />
        <Form error className={isMobile ? 'mb-30' : ''}>
          <DropZone
            name="formationDoc"
            fielddata={FORM_DOCS_FRM.fields.formationDoc}
            ondrop={this.onFormationDocDrop}
            onremove={this.confirmRemoveDoc}
            containerclassname={`${isMobile ? 'mb-30' : ''} fluid`}
            uploadtitle="Choose a file or drag it here"
          />
          <DropZone
            name="operatingAgreementDoc"
            fielddata={FORM_DOCS_FRM.fields.operatingAgreementDoc}
            ondrop={this.onOperatingAgreementDocDrop}
            onremove={this.confirmRemoveDoc}
            containerclassname={`${isMobile ? 'mb-30' : ''} fluid`}
            uploadtitle="Choose a file or drag it here"
          />
          <DropZone
            name="einVerificationDoc"
            fielddata={FORM_DOCS_FRM.fields.einVerificationDoc}
            ondrop={this.onEinVerificationDocDrop}
            onremove={this.confirmRemoveDoc}
            containerclassname={`${isMobile ? 'mb-30' : ''} fluid`}
            uploadtitle="Choose a file or drag it here"
          />
            <Divider hidden />
          {errors
            && (
<Message error className="mt-30">
              <ListErrors errors={[errors.message]} />
            </Message>
            )
          }
          {isMobile && (
            <Button fluid primary className="relaxed" content="Continue" disabled={!FORM_DOCS_FRM.meta.isValid || errors} onClick={this.handleContinueButton} />
          )
          }
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
      </>
    );
  }
}
