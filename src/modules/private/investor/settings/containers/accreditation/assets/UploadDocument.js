import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { DropZoneConfirm as DropZone } from '../../../../../../../theme/form';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class UploadDocument extends Component {
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.setFormData('ASSETS_UPLOAD_DOC_FORM', 'accreditation', accountType);
  }
  onFileDrop = (files, field) => {
    this.props.accreditationStore.setFileUploadData('ASSETS_UPLOAD_DOC_FORM', field, files);
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
    const { ASSETS_UPLOAD_DOC_FORM } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Assets</Header>
        <p className="center-align">To verify your accreditation, you can upload a statement from a financial institution, asset appraisals, or a letter from your lawyer, accountant, investment advisor or investment broker indicating net assets.</p>
        <Divider hidden />
        <Form error>
          <DropZone
            multiple
            name="statementDoc"
            fielddata={ASSETS_UPLOAD_DOC_FORM.fields.statementDoc}
            ondrop={this.onFileDrop}
            onremove={this.handleDelDoc}
            containerclassname="fluid"
          />
          <Divider hidden />
          <div className="center-align">
            <Button onClick={() => this.props.clicked('ASSETS_UPLOAD_DOC_FORM')} primary size="large" disabled={!ASSETS_UPLOAD_DOC_FORM.meta.isValid}>Confirm</Button>
          </div>
        </Form>
      </div>
    );
  }
}
