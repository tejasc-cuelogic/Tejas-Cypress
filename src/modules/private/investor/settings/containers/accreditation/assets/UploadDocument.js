import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Confirm } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { DropZone } from '../../../../../../../theme/form';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class UploadDocument extends Component {
  onFileDrop = (files, field) => {
    this.props.accreditationStore.setFileUploadData('ASSETS_UPLOAD_DOC_FORM', field, files);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  confirmRemoveDoc = (e, name) => {
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelDoc = (field) => {
    this.props.accreditationStore.removeUploadedData('ASSETS_UPLOAD_DOC_FORM', field);
    this.props.uiStore.setConfirmBox('');
  }
  showThanksNote = () => {
    this.props.history.push(`${this.props.match.url}/thanksnote`);
  }

  render() {
    const { ASSETS_UPLOAD_DOC_FORM } = this.props.accreditationStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Upload documents</Header>
        <p className="center-align">Upload your W2, 1040, or other IRS or foreign tax authority documents containing your salary for the past 2 years, or a letter from your lawyer, CPA, investment advisor or investment broker verifying your income.</p>
        <Form error>
          <DropZone
            name="statementDoc"
            fielddata={ASSETS_UPLOAD_DOC_FORM.fields.statementDoc}
            ondrop={this.onFileDrop}
            onremove={this.confirmRemoveDoc}
            containerclassname="fluid"
          />
          <div className="center-align">
            <Button onClick={this.showThanksNote} primary size="large" disabled={!ASSETS_UPLOAD_DOC_FORM.meta.isValid}>Confirm</Button>
          </div>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'statementDoc'}
          onCancel={this.handleDelCancel}
          onConfirm={() => this.handleDelDoc(confirmBox.entity)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
