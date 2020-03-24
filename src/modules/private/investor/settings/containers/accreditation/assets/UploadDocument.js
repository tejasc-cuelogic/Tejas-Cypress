import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { DropZoneConfirm as DropZone, FormCheckbox } from '../../../../../../../theme/form';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class UploadDocument extends Component {
  constructor(props) {
    super(props);
    if (this.props.isEntity || this.props.isUploadLater) {
      this.props.accreditationStore.setDefaultCheckboxVal();
    }
  }

  onFileDrop = (files, field) => {
    const { accountType, isUploadLater, isIncome } = this.props;
    const tagToSet = (isUploadLater && isIncome) ? 'Income' : 'Assets';
    const isIncomeUploadLater = !!(isUploadLater && isIncome);
    this.props.accreditationStore.setFileUploadData('ASSETS_UPLOAD_DOC_FORM', field, files, accountType, tagToSet, '', '', isIncomeUploadLater);
  }

  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  confirmRemoveDoc = (e, name) => {
    this.props.uiStore.setConfirmBox(name);
  }

  handleDelDoc = (field, index) => {
    this.props.accreditationStore.removeUploadedData('ASSETS_UPLOAD_DOC_FORM', field, index, this.props.accountType);
  }

  render() {
    const { ASSETS_UPLOAD_DOC_FORM, formChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h4">{(this.props.isEntity) ? 'Upload verification letter' : this.props.isUploadLater ? 'Upload letter' : 'Upload Documents'}</Header>
        <p>{(this.props.isEntity)
          ? 'Upload a signed letter from your lawyer, CPA, investment advisor or investment broker verifying your entity`s status as an accredited investor.'
          : this.props.isUploadLater
            ? 'Upload a letter from your personal lawyer, CPA, investment advisor, or investment broker that verifies that they have reviewed and confirmed evidence of your accredited investor status.'
            : 'To verify your net worth, you can upload personal financial statements, a statement from a financial institution, asset appraisals, or a signed letter from your lawyer, accountant, investment advisor or investment broker indicating your status as an accredited investor.'}</p>
        <Divider hidden />
        <Form>
          <DropZone
            multiple
            name="statementDoc"
            fielddata={ASSETS_UPLOAD_DOC_FORM.fields.statementDoc}
            ondrop={this.onFileDrop}
            onremove={this.handleDelDoc}
            containerclassname="fluid"
            uploadtitle="Choose a File"
          />
          {!this.props.isEntity && !this.props.isUploadLater
            && (
              <FormCheckbox
                fielddata={ASSETS_UPLOAD_DOC_FORM.fields.isAccepted}
                name="isAccepted"
                changed={(e, result) => formChange(e, result, 'ASSETS_UPLOAD_DOC_FORM')}
                defaults
                disabled={ASSETS_UPLOAD_DOC_FORM.fields.statementDoc.value.length === 0}
                containerclassname="ui relaxed list mt-40 neutral-text"
              />
            )
          }
          <Divider hidden />
          {this.props.isUploadLater
            && (
              <p className="note">
                <b>Note:</b> The verification letter is only valid for 90 days from the date of the letter. If your letter is older than 90 days or will soon expire, please request a new letter.
              </p>
            )
          }
          <Divider hidden />
          <Button onClick={() => this.props.clicked('ASSETS_UPLOAD_DOC_FORM')} primary disabled={!ASSETS_UPLOAD_DOC_FORM.meta.isValid}>Submit</Button>
        </Form>
      </div>
    );
  }
}
