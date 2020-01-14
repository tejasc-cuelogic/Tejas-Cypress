import React from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Button, Icon, Header, Divider, Confirm } from 'semantic-ui-react';
import { MaskedInput, DropZoneConfirm as DropZone } from '../../../../../../theme/form';

export default inject('offeringCreationStore')(observer(({ offeringCreationStore }) => {
  const {
    OFFERING_CLOSE_EXPORT_ENVELOPES_FRM, maskArrayChange, confirmModal, confirmModalName, removeData,
  } = offeringCreationStore;

  const onFileDrop = (files, name, index) => {
    const uploadEnum = 'DOCUMENTS_LEGAL_DATAROOM';
    offeringCreationStore.setFileUploadDataMulitple('OFFERING_CLOSE_EXPORT_ENVELOPES_FRM', 'documents', name, files, uploadEnum, index, true);
  };

  const handleDelDoc = (field, index = undefined) => {
    offeringCreationStore.removeUploadedDataMultiple('OFFERING_CLOSE_EXPORT_ENVELOPES_FRM', field, index, 'documents');
  };

  const addMore = () => offeringCreationStore.addMore('OFFERING_CLOSE_EXPORT_ENVELOPES_FRM', 'documents');

  const toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    offeringCreationStore.toggleConfirmModal(index, formName);
  };

  return (
    <div className="content">
      <Form className="mt-30">
        <Header as="h4">
        Export Envelopes
          {OFFERING_CLOSE_EXPORT_ENVELOPES_FRM.fields.documents.length !== 5
          && (
          <Button.Group size="mini" floated="right">
            <Button onClick={() => addMore()} primary compact content="Add" />
          </Button.Group>
          )
          }
        </Header>
        <Divider hidden />
        <div className="ui basic compact table form-table">
          <div className="row-wrap thead">
            <div className="balance-half">File Upload</div>
            <div className="balance-half">Page in envelope to replace</div>
            <div className="action width-70">Actions</div>
          </div>
          {OFFERING_CLOSE_EXPORT_ENVELOPES_FRM.fields.documents.map((document, docIndex) => (
            <div className="row-wrap">
              <div className="balance-half">
                <DropZone
                  size="small"
                  className="secondary"
                  name="upload"
                  sharableLink
                  hideFields
                  fielddata={document.upload}
                  uploadtitle="Upload"
                  ondrop={(files, name) => onFileDrop(files, name, docIndex)}
                  onremove={fieldName => handleDelDoc(fieldName, docIndex)}
                />
              </div>
              <div className="balance-half simple-drag-row-title">
                <MaskedInput
                  hidelabel
                  size="small"
                  changed={(values, name) => maskArrayChange(values, 'OFFERING_CLOSE_EXPORT_ENVELOPES_FRM', name, 'documents', docIndex)}
                  ishidelabel
                  name="replacePage"
                  fielddata={document.replacePage}
                  number
                />
              </div>
              <div className="action">
                <Button disabled={OFFERING_CLOSE_EXPORT_ENVELOPES_FRM.fields.documents.length === 1} icon className="link-button">
                  <Icon className="ns-trash" onClick={e => toggleConfirmModal(e, docIndex, 'OFFERING_CLOSE_EXPORT_ENVELOPES_FRM')} />
                </Button>
              </div>
            </div>
          ))
          }
        </div>
        <Divider hidden />
        <div className="action width-100 right-align">
        <Button.Group compact>
          {['Save', 'Send Text Export', 'Export Envelopes'].map(cta => (
              <Button primary> {cta} </Button>))
          }
          </Button.Group>
        </div>
      </Form>
      <Confirm
        header="Confirm"
        content="Are you sure you want to remove this document?"
        open={confirmModal}
        onCancel={toggleConfirmModal}
        onConfirm={() => removeData(confirmModalName, 'documents')}
        size="mini"
        className="deletion"
      />
    </div>
  );
}));
