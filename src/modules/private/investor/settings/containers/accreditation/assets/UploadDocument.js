import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Confirm } from 'semantic-ui-react';
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
        <Header as="h3" textAlign="center">Assets</Header>
        <p className="center-align">To verify your accreditation, you can upload a statement from a financial institution, asset appraisals, or a letter from your lawyer, accountant, investment advisor or investment broker indicating net assets.</p>
        <Divider hidden />
        <Form error>
          <DropZone
            multiple
            name="statementDoc"
            fielddata={ASSETS_UPLOAD_DOC_FORM.fields.statementDoc}
            ondrop={this.onFileDrop}
            onremove={this.confirmRemoveDoc}
            containerclassname="fluid"
          />
          <Divider hidden />
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
