/* eslint-disable */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';
import { Form, Header, Button, Divider, Icon, Confirm } from 'semantic-ui-react';
import { remove, forEach } from 'lodash';
import { FormInput, DropZoneConfirm as DropZone, FormRadioGroup } from '../../../../../../../theme/form';
import ButtonGroupType2 from '../../ButtonGroupType2';
import DocumentMapping from './documentMapping';

let uploadFileArr = [];
let removedArr = [];
const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder mr-10" />);
const SortableItem = SortableElement(({ closingBinder, offeringClose, document, isReadonly, formArrayChange, onFileDrop, handleDelDoc, handleLockUnlock, toggleConfirmModal, docIndx, formName, length, showLockActivity, isBusinessApplication, docValidationArr }) => {
  return (
    <>
      <div className="row-wrap">
        <div className="width-70">
          {!offeringClose
            && <DragHandle />
          }
        </div>
        <div className="balance-half">
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
              customValidExtension={docValidationArr}
            />
          }
        </div>
        <div className="width-130">
          <FormRadioGroup
            readOnly={isReadonly}
            containerclassname={isReadonly ? 'display-only' : ''}
            fielddata={document.mappingRequired}
            default
            name={`mappingRequired[${docIndx}]`}
            eleName="mappingRequired"
            changed={(e, result) => formArrayChange(e, result, formName, 'documents', docIndx)}
          />
        </div>
        <div className="action">
          {showLockActivity
            && (<Button disabled={isReadonly} icon circular color={!offeringClose ? document.accreditedOnly.value ? 'red' : 'green' : ''} className="link-button">
              <Icon className={!offeringClose ? document.accreditedOnly.value ? 'ns-lock' : 'ns-unlock' : document.accreditedOnly.value ? 'ns-view' : 'ns-no-view'} onClick={() => handleLockUnlock(docIndx)} />
            </Button>)
          }
          <Button disabled={isReadonly || length === 1 || (isBusinessApplication && document.accreditedOnly.value)} icon circular className="link-button">
            <Icon className="ns-trash" onClick={e => toggleConfirmModal(e, docIndx, formName)} />
          </Button>
        </div>
      </div>
      <div className="pl-30 upload-docs-subsection">
        <DocumentMapping
          isReadOnlyFlag={false}
          isSaveOnly
          header="Document Mapping"
          uploadFormKey="mapping"
          mapIndex={docIndx}
          mappingData={document.mapping}
        />
      </div>
    </>
  );
});

const SortableList = SortableContainer(({ closingBinder, offeringClose, docs, isReadonly, formArrayChange, onFileDrop, handleDelDoc, handleLockUnlock, toggleConfirmModal, formName, showLockActivity, isBusinessApplication, docValidationArr }) => {
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
          showLockActivity={showLockActivity}
          isBusinessApplication={isBusinessApplication}
          docValidationArr={docValidationArr}
        />
      ))}
    </div>
  );
});

@inject('offeringCreationStore', 'userStore', 'offeringsStore', 'uiStore')
@observer
export default class DocumentUpload extends Component {

  onFileDrop = (files, name, index) => {
    const { uploadEnum, metaInfo, uploadFormKey } = this.props
    let fileArr = '';
    this.props.offeringCreationStore.setFileUploadDataMulitpleVartually(metaInfo.form, uploadFormKey, name, files, uploadEnum, index, true);
    this.forceUpdate();
    fileArr = files[0];
    fileArr.currentIndex = index
    uploadFileArr.push(fileArr);
    // uploadFileArr.push({ fileDetails: files[0], currentIndex: index });

  }
  handleDelDoc = (field, index = undefined) => {
    const { metaInfo, uploadFormKey } = this.props;
    const isMultipRmoveArray = true;
    this.props.offeringCreationStore.removeUploadedDataMultiple(metaInfo.form, field, index, uploadFormKey, false, isMultipRmoveArray);
    this.forceUpdate();
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
    if (index >= 0) {
      removedArr.push(index);
    }
  }
  addMore = (e, formName, uploadFormKey) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMoreUploadForm(formName, uploadFormKey);
  }
  handleLockUnlock = (index) => {
    const { metaInfo } = this.props;
    this.props.offeringCreationStore.setAccreditedOnlyField(metaInfo.form, index);
    this.forceUpdate();
  }

  handleFormSubmitForBusinessApplication = (isApproved = null) => {
    const { updateUploadDocs, removeFileIdsList } = this.props.offeringCreationStore;
    const { metaInfo, uploadFormKey, uploadEnum } = this.props;
    const docs = [...(this.props[metaInfo.store][metaInfo.form].fields.documents)];
    const uploadMeta = {
      form: metaInfo.form,
      uploadFormKey: uploadFormKey,
      fieldName: 'upload',
      uploadEnum: uploadEnum,
    };
    remove(uploadFileArr, n => removedArr.includes(n.currentIndex));
    // console.log('uploadFileArr passing==>', uploadFileArr);
    // console.log('removedArr==>', removedArr);
    // forEach(docs, function(value, key) {
    //   console.log(key);
    //   console.log(value);
    // });
    updateUploadDocs(uploadMeta, uploadFileArr);
    uploadFileArr = [];
    removedArr = [];
  }

  onSortEnd = ({ oldIndex, newIndex }, isReadonly) => {
    if (!isReadonly) {
      const { metaInfo } = this.props;
      const docs = [...this.props[metaInfo.store][metaInfo.form].fields.documents];
      this.props.offeringCreationStore.setUploadDocsOrder(arrayMove(docs, oldIndex, newIndex), metaInfo.form);
    }
  };
  render() {
    const {
      match,
      offeringClose,
      closingBinder,
      uiStore,
      header,
      isSaveOnly,
      isButtonGroup,
      uploadFormKey,
      metaInfo,
      docValidationArr,
    } = this.props;
    const { inProgress } = uiStore;
    const { isIssuer } = this.props.userStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const { offer } = this.props.offeringsStore;
    const submitted = (offer && offer.legal && offer.legal.dataroom &&
      offer.legal.dataroom.submitted) ? offer.legal.dataroom.submitted : null;
    const approved = (offer && offer.legal && offer.legal.dataroom &&
      offer.legal.dataroom.approved) ? offer.legal.dataroom.approved : null;
    const isReadonly = (!offeringClose && ((submitted && !isManager) || (isManager && approved && approved.status) || !!(this.props.isReadOnlyFlag)));
    const {
      formArrayChange,
      confirmModal,
      confirmModalName,
      removeData,
    } = this.props.offeringCreationStore;
    const formName = metaInfo.form;
    const docs = [...(this.props[metaInfo.store][metaInfo.form].fields.documents)];
    return (
      <div className={isIssuer || (isIssuer && !match.url.includes('offering-creation')) ? 'ui card fluid form-card' : ''}>
        <Form>
          <Header as="h4" className={offeringClose ? 'offering-close-header' : ''}>
            {header || ''}
            {!isReadonly &&
              <Button.Group size="mini" floated="right">
                <Button onClick={e => this.addMore(e, formName, uploadFormKey)} primary compact content="Add" />
              </Button.Group>
            }
          </Header>
          <Divider hidden />
          <div className="ui basic compact table form-table">
            <div className="row-wrap thead">
              <div className="width-70" />
              <div className="balance-half">Document Name</div>
              <div className="balance-half">Document</div>
              <div className="width-130">Mappeing Required</div>
              <div className="action">Actions</div>
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
              showLockActivity={false}
              isBusinessApplication={true}
              docValidationArr={docValidationArr}
            />
          </div>
          <Divider hidden />
          {!offeringClose && isButtonGroup
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
          {!isReadonly && isSaveOnly
            &&
            (
              <div className="right-align mt-20">
                <Button disabled={!this.props[metaInfo.store][metaInfo.form].meta.isValid || inProgress === 'save'} loading={inProgress === 'save'} primary className="relaxed" onClick={this.handleFormSubmitForBusinessApplication} >Save</Button>
              </div>
            )
          }
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this document?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, 'documents', false, true)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
