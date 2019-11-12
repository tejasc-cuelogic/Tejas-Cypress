import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Message } from 'semantic-ui-react';
import { DropZoneConfirm as DropZone } from '../../../../../../../theme/form';
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

  handleDelDoc = (field) => {
    this.props.entityAccountStore.removeUploadedData('FORM_DOCS_FRM', field, 'Formation doc');
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const { FORM_DOCS_FRM } = this.props.entityAccountStore;
    const { errors } = this.props.uiStore;
    return (
      <>
        <Header as="h3" textAlign="center">Upload required documentation</Header>
        <Divider hidden />
        <Form error>
          <DropZone
            name="formationDoc"
            fielddata={FORM_DOCS_FRM.fields.formationDoc}
            ondrop={this.onFormationDocDrop}
            onremove={this.handleDelDoc}
            containerclassname="fluid"
            uploadtitle="Choose a file or drag it here"
          />
          <DropZone
            name="operatingAgreementDoc"
            fielddata={FORM_DOCS_FRM.fields.operatingAgreementDoc}
            ondrop={this.onOperatingAgreementDocDrop}
            onremove={this.handleDelDoc}
            containerclassname="fluid"
            uploadtitle="Choose a file or drag it here"
          />
          <DropZone
            name="einVerificationDoc"
            fielddata={FORM_DOCS_FRM.fields.einVerificationDoc}
            ondrop={this.onEinVerificationDocDrop}
            onremove={this.handleDelDoc}
            containerclassname="fluid"
            uploadtitle="Choose a file or drag it here"
          />
          {errors
            && (
              <Message error className="mt-30">
                <ListErrors errors={[errors.message]} />
              </Message>
            )
          }
        </Form>
      </>
    );
  }
}
