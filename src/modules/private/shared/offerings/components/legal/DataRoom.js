/* eslint-disable */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';
import { Form, Header, Button, Divider, Icon, Confirm } from 'semantic-ui-react';
import { get } from 'lodash';
import { FormInput, DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import ButtonGroupType2 from '../ButtonGroupType2';

const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder mr-10" />);
const SortableItem = SortableElement(({ closingBinder, offeringClose, document, isReadonly, formArrayChange, onFileDrop, handleDelDoc, handleLockUnlock, toggleConfirmModal, docIndx, formName, length }) => {
  return (
    <div className="row-wrap">
      <div className="balance-half simple-drag-row-title">
        {!offeringClose
          && <DragHandle />
        }
        <FormInput
          displayMode={isReadonly}
          name="name"
          fielddata={document.name}
          size="small"
          changed={(e, result) => formArrayChange(e, result, formName, closingBinder ? 'closingBinder' : 'documents', docIndx)}
          ishidelabel
        />
      </div>
      <div className="balance-half">
      {closingBinder && ['PENDING', 'FAILED'].includes(document.status.value) ?
        document.status.value
        :
        <DropZone
          disabled={isReadonly}
          size="small"
          className="secondary"
          name="upload"
          sharableLink
          hideFields
          fielddata={document.upload}
          uploadtitle="Upload"
          ondrop={(files, name) => onFileDrop(files, name, docIndx)}
          onremove={fieldName => handleDelDoc(fieldName, docIndx)}
        />
      }
      </div>
      <div className="action">
        <Button disabled={isReadonly} icon circular color={!offeringClose ? document.accreditedOnly.value ? 'red' : 'green' : ''} className="link-button">
          <Icon className={!offeringClose ? document.accreditedOnly.value ? 'ns-lock' : 'ns-unlock' : document.accreditedOnly.value ? 'ns-view' : 'ns-no-view'} onClick={() => handleLockUnlock(docIndx)} />
        </Button>
        <Button disabled={isReadonly || length === 1} icon circular className="link-button">
          <Icon className="ns-trash" onClick={e => toggleConfirmModal(e, docIndx, formName)} />
        </Button>
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({ closingBinder, offeringClose, docs, isReadonly, formArrayChange, onFileDrop, handleDelDoc, handleLockUnlock, toggleConfirmModal, formName }) => {
  return (
    <div>
      {docs.map((doc, index) => (
        <SortableItem
          offeringClose={offeringClose}
          closingBinder={closingBinder}
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
          length={docs.length}
          index={index}
        />
      ))}
    </div>
  );
});

@inject('offeringCreationStore', 'userStore', 'offeringsStore', 'uiStore')
@observer
export default class DataRoom extends Component {
  // constructor(props) {
  //   super(props);
  //   const { setFormData } = this.props.offeringCreationStore;
  //   setFormData('DATA_ROOM_FRM', 'legal.dataroom');
  //   setFormData('DOCUMENTATION_FRM', 'legal.documentation.issuer');
  //   setFormData('ADMIN_DOCUMENTATION_FRM', 'legal.documentation.admin');
  // }
  onFileDrop = (files, name, index) => {
    const { closingBinder, supplementalAgreements } = this.props;
    // closingBinder ? 'OFFERING_CLOSING_BINDER' : supplementalAgreements ? 'OFFERING_SUPPLEMENTAL_AGREEMENT' : 'DOCUMENTS_LEGAL_DATAROOM';
    const uploadEnum = 'DOCUMENTS_LEGAL_DATAROOM';
    this.props.offeringCreationStore.setFileUploadDataMulitple(closingBinder ? 'CLOSING_BINDER_FRM' : 'DATA_ROOM_FRM', closingBinder ? 'closingBinder' : 'documents', name, files, uploadEnum, index, true);
  }
  handleDelDoc = (field, index = undefined) => {
    this.props.offeringCreationStore.removeUploadedDataMultiple(this.props.closingBinder ? 'CLOSING_BINDER_FRM' : 'DATA_ROOM_FRM', field, index, this.props.closingBinder ? 'closingBinder' : 'documents');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, this.props.closingBinder ? 'closingBinder' : 'documents');
  }
  handleLockUnlock = (index) => {
    this.props.offeringCreationStore.setAccreditedOnlyField(this.props.closingBinder ? 'CLOSING_BINDER_FRM' : 'DATA_ROOM_FRM', index);
    this.forceUpdate();
  }
  handleFormSubmit = (isApproved = null) => {
    const { DATA_ROOM_FRM, CLOSING_BINDER_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, this.props.closingBinder ? CLOSING_BINDER_FRM.fields : DATA_ROOM_FRM.fields, 'legal', 'dataroom', true, undefined, isApproved);
  }
  onSortEnd = ({ oldIndex, newIndex }, isReadonly) => {
    if (!isReadonly) {
      const docs = [...this.props.offeringCreationStore.DATA_ROOM_FRM.fields.documents];
      this.props.offeringCreationStore.setDataRoomDocsOrder(arrayMove(docs, oldIndex, newIndex));
    }
  };
  render() {
    const { match, offeringClose, closingBinder, uiStore } = this.props;
    const { inProgress } = uiStore;
    const { isIssuer } = this.props.userStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const { offer } = this.props.offeringsStore;
    const submitted = (offer && offer.legal && offer.legal.dataroom &&
      offer.legal.dataroom.submitted) ? offer.legal.dataroom.submitted : null;
    const approved = (offer && offer.legal && offer.legal.dataroom &&
      offer.legal.dataroom.approved) ? offer.legal.dataroom.approved : null;
    const isReadonly = (!offeringClose && ((submitted && !isManager) || (isManager && approved && approved.status)));
    const {
      DATA_ROOM_FRM,
      CLOSING_BINDER_FRM,
      formArrayChange,
      confirmModal,
      confirmModalName,
      removeData,
      initializeClosingBinder,
    } = this.props.offeringCreationStore;
    const formName = closingBinder ? 'CLOSING_BINDER_FRM' : 'DATA_ROOM_FRM';
    const docs = [...(closingBinder ? CLOSING_BINDER_FRM.fields.closingBinder : DATA_ROOM_FRM.fields.documents)];
    return (
      <div className={isIssuer || (isIssuer && !match.url.includes('offering-creation')) ? 'ui card fluid form-card' : ''}>
        <Form>
          <Header as="h4" className={offeringClose ? 'offering-close-header' : ''}>
          {!offeringClose ? 'Data Room Documents' : ''}
            {!isReadonly &&
              <Button.Group size="mini" floated="right">
                {(closingBinder && (!get(offer, 'closingBinder') || !get(offer, 'closingBinder[0]')))
                  && <Button loading={inProgress} color="blue" content="Initialize Closing Binder" onClick={initializeClosingBinder} />
                }
                <Button onClick={e => this.addMore(e, formName)} primary compact content="Add" />
              </Button.Group>
            }
          </Header>
          <Divider hidden />
          <div className="ui basic compact table form-table">
            <div className="row-wrap thead">
              <div className="balance-half">Document Name</div>
              <div className="balance-half">Document</div>
              <div className="action width-70">Actions</div>
            </div>
            <SortableList
              offeringClose={offeringClose}
              closingBinder={closingBinder}
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
          {!offeringClose
          &&
          (
            <ButtonGroupType2
              submitted={submitted}
              isManager={isManager}
              approved={approved}
              updateOffer={this.handleFormSubmit}
            />
          )
          }
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this document?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, this.props.closingBinder ? 'closingBinder' : 'documents')}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
