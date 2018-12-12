import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import ReactDragList from 'react-drag-list';
import { Form, Header, Button, Divider, Icon, Confirm } from 'semantic-ui-react';
import { FormInput, DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import ButtonGroupType2 from '../ButtonGroupType2';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class DataRoom extends Component {
  componentWillMount() {
    if (!this.props.offeringCreationStore.initLoad.includes('DATA_ROOM_FRM')) {
      this.props.offeringCreationStore.setFormData('DATA_ROOM_FRM', 'legal.dataroom');
    }
  }
  onFileDrop = (files, name, index) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DATA_ROOM_FRM', 'documents', name, files, 'DOCUMENTS_LEGAL_DATAROOM', index, true);
  }
  handleDelDoc = (field, index = undefined) => {
    this.props.offeringCreationStore.removeUploadedDataMultiple('DATA_ROOM_FRM', field, index, 'documents');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, 'documents');
  }
  handleLockUnlock = (index) => {
    this.props.offeringCreationStore.setAccreditedOnlyField(index);
  }
  handleFormSubmit = (isApproved = null) => {
    const { DATA_ROOM_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, DATA_ROOM_FRM.fields, 'legal', 'dataroom', true, undefined, isApproved);
  }
  handleUpdate = (evt, updated) => {
    console.log(evt); // tslint:disable-line
    console.log(updated); // tslint:disable-line
    // this.setState({
    //   dataSource: [...updated, {
    //     color: '#FFAA00',
    //     title: 'Added Engineer',
    //     text: 'Added Engineer',
    //   }]
    // })
  }
  render() {
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const { offer } = this.props.offeringsStore;
    const submitted = (offer && offer.legal && offer.legal.dataroom &&
      offer.legal.dataroom.submitted) ? offer.legal.dataroom.submitted : null;
    const approved = (offer && offer.legal && offer.legal.dataroom &&
      offer.legal.dataroom.approved) ? offer.legal.dataroom.approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    const {
      DATA_ROOM_FRM,
      formArrayChange,
      confirmModal,
      confirmModalName,
      removeData,
    } = this.props.offeringCreationStore;
    const formName = 'DATA_ROOM_FRM';
    return (
      <div className={isIssuer || (isIssuer && !match.url.includes('offering-creation')) ? 'ui card fluid form-card' : ''}>
        <Form>
          <Header as="h4">
            Data Room Documents
            <Button.Group size="mini" floated="right">
              <Button onClick={e => this.addMore(e, formName)} primary compact content="Add" />
            </Button.Group>
          </Header>
          <Divider hidden />
          <div className="ui basic compact table form-table">
            <div className="row-wrap thead">
              <div className="balance-half">Document Name</div>
              <div className="balance-half">Document</div>
              <div className="date">Updated on</div>
              <div className="status">is Public?</div>
              <div className="action">Actions</div>
            </div>
            <ReactDragList
              dataSource={DATA_ROOM_FRM.fields.documents.length && DATA_ROOM_FRM.fields.documents}
              rowKey="title"
              row={(document, index) => (
                <div key={index} className="row-wrap">
                  <div className="balance-half simple-drag-row-title">
                    <FormInput
                      displayMode={isReadonly}
                      name="name"
                      fielddata={document.name}
                      size="small"
                      changed={(e, result) => formArrayChange(e, result, formName, 'documents', index)}
                      ishidelabel
                    />
                  </div>
                  <div className="balance-half">
                    <DropZone
                      disabled={isReadonly}
                      size="small"
                      className="secondary"
                      name="upload"
                      fielddata={document.upload}
                      uploadtitle="Upload"
                      ondrop={(files, name) => this.onFileDrop(files, name, index)}
                      onremove={fieldName => this.handleDelDoc(fieldName, index)}
                    />
                    {/* <Link to="/" className="link"><Icon className="ns-file" />
                    disclosure-document.pdf</Link> */}
                  </div>
                  <div className="date">12/31/2016</div>
                  <div className="status">Yes</div>
                  <div className="action">
                    <Button icon circular color={document.accreditedOnly.value ? 'red' : 'green'} className="link-button">
                      <Icon className={document.accreditedOnly.value ? 'ns-lock' : 'ns-unlock'} onClick={() => this.handleLockUnlock(index)} />
                    </Button>
                    <Button icon circular className="link-button">
                      <Icon className="ns-trash" onClick={e => this.toggleConfirmModal(e, index, formName)} />
                    </Button>
                  </div>
                </div>
              )}
              handles={false}
              onUpdate={this.handleUpdate}
            />
          </div>
          <Divider hidden />
          <ButtonGroupType2
            submitted={submitted}
            isManager={isManager}
            approved={approved}
            updateOffer={this.handleFormSubmit}
          />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this document?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, 'documents')}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
