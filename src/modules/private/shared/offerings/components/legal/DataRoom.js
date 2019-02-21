/* eslint-disable */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';
import { Form, Header, Button, Divider, Icon, Confirm } from 'semantic-ui-react';
import { FormInput, DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import ButtonGroupType2 from '../ButtonGroupType2';

const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder mr-10" />);
const SortableItem = SortableElement(({ document, isReadonly, formArrayChange, onFileDrop, handleDelDoc, handleLockUnlock, toggleConfirmModal, docIndx, formName }) => {
  return (
    <div className="row-wrap">
      <div className="balance-half simple-drag-row-title">
        <DragHandle />
        <FormInput
          displayMode={isReadonly}
          name="name"
          fielddata={document.name}
          size="small"
          changed={(e, result) => formArrayChange(e, result, formName, 'documents', docIndx)}
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
          ondrop={(files, name) => onFileDrop(files, name, docIndx)}
          onremove={fieldName => handleDelDoc(fieldName, docIndx)}
        />
      </div>
      <div className="action">
        <Button disabled={isReadonly} icon circular color={document.accreditedOnly.value ? 'red' : 'green'} className="link-button">
          <Icon className={document.accreditedOnly.value ? 'ns-lock' : 'ns-unlock'} onClick={() => handleLockUnlock(docIndx)} />
        </Button>
        <Button disabled={isReadonly} icon circular className="link-button">
          <Icon className="ns-trash" onClick={e => toggleConfirmModal(e, docIndx, formName)} />
        </Button>
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({ docs, isReadonly, formArrayChange, onFileDrop, handleDelDoc, handleLockUnlock, toggleConfirmModal, formName }) => {
  return (
    <div>
      {docs.map((doc, index) => (
        <SortableItem
          key={`item-${index}`}
          docIndx={index}
          document={doc}
          formArrayChange={formArrayChange}
          isReadonly={isReadonly}
          onFileDrop={onFileDrop}
          handleDelDoc={handleDelDoc}
          handleLockUnlock={handleLockUnlock}
          toggleConfirmModal={toggleConfirmModal}
          formName={formName}
          index={index}
        />
      ))}
    </div>
  );
});

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class DataRoom extends Component {
  componentWillMount() {
      this.props.offeringCreationStore.setFormData('DATA_ROOM_FRM', 'legal.dataroom');
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
    this.forceUpdate();
  }
  handleFormSubmit = (isApproved = null) => {
    const { DATA_ROOM_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, DATA_ROOM_FRM.fields, 'legal', 'dataroom', true, undefined, isApproved);
  }
  onSortEnd = ({ oldIndex, newIndex }, isReadonly) => {
    if (!isReadonly) {
      const docs = [...this.props.offeringCreationStore.DATA_ROOM_FRM.fields.documents];
      this.props.offeringCreationStore.setDataRoomDocsOrder(arrayMove(docs, oldIndex, newIndex));
    }
  };
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
    const docs = [...DATA_ROOM_FRM.fields.documents];
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
              <div className="action">Actions</div>
            </div>
            <SortableList
              docs={docs}
              pressDelay={100}
              onSortEnd={(e) => this.onSortEnd(e, isReadonly)}
              formArrayChange={formArrayChange}
              isReadonly={isReadonly}
              onFileDrop={this.onFileDrop}
              handleDelDoc={this.handleDelDoc}
              handleLockUnlock={this.handleLockUnlock}
              toggleConfirmModal={this.toggleConfirmModal}
              formName={formName}
              lockAxis="y"
              useDragHandle
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
