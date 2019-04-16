import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { DropZoneConfirm as DropZone, FormCheckbox } from '../../../../../../../theme/form';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class UploadDocument extends Component {
  componentWillMount() {
    if (this.props.isEntity) {
      this.props.accreditationStore.setDefaultCheckboxVal();
    }
  }
  onFileDrop = (files, field) => {
    this.props.accreditationStore.setFileUploadData('ASSETS_UPLOAD_DOC_FORM', field, files, this.props.accountType, 'Assets');
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  confirmRemoveDoc = (e, name) => {
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelDoc = (field, index) => {
    this.props.accreditationStore.removeUploadedData('ASSETS_UPLOAD_DOC_FORM', field, index);
  }

  render() {
    const { ASSETS_UPLOAD_DOC_FORM, formChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">{this.props.isEntity ? 'Upload verification letter' : 'Net Worth'}</Header>
        <p className="center-align">{this.props.isEntity ? 'Upload a signed letter from your lawyer, CPA, investment advisor or investment broker verifying your entity`s status as an accredited investor.' : 'To verify your net worth, you can upload personal financial statements, a statement from a financial institution, asset appraisals, or a signed letter from your lawyer, accountant, investment advisor or investment broker indicating your status as an accredited investor.'}</p>
        <Divider hidden />
        <Form>
          <DropZone
            multiple
            name="statementDoc"
            fielddata={ASSETS_UPLOAD_DOC_FORM.fields.statementDoc}
            ondrop={this.onFileDrop}
            onremove={this.handleDelDoc}
            containerclassname="fluid"
          />
          {!this.props.isEntity &&
            <FormCheckbox
              fielddata={ASSETS_UPLOAD_DOC_FORM.fields.isAccepted}
              name="isAccepted"
              changed={(e, result) => formChange(e, result, 'ASSETS_UPLOAD_DOC_FORM')}
              defaults
              containerclassname="ui relaxed list"
            />
          }
          <Divider hidden />
          <div className="center-align">
            <Button onClick={() => this.props.clicked('ASSETS_UPLOAD_DOC_FORM')} primary size="large" disabled={!ASSETS_UPLOAD_DOC_FORM.meta.isValid}>Submit</Button>
          </div>
        </Form>
      </div>
    );
  }
}
