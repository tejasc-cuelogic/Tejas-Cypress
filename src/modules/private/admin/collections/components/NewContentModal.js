import React from 'react';
import { inject } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { Form, Divider, Header, Modal, Button } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_CONTENT_FRM',
};

function NewContentModal(props) {
  const history = useHistory();

  const handleFormSubmit = () => {
    const params = {
      keyName: false,
      forms: ['COLLECTION_CONTENT_FRM'],
    };
    const { reOrderHandle, upsertCollection } = props.collectionStore;
    reOrderHandle(props.collectionStore.COLLECTION_CONTENT_FRM.fields.content);
    upsertCollection('adminCollectionUpsert', params).then(() => {
      history.push(`${props.refLink}/${props.index + 1}`);
    });
  };
  const { smartElement, index, toggleModal, uiStore, collectionStore } = props;
  const { inProgress } = uiStore;
  const { COLLECTION_CONTENT_FRM } = collectionStore;
  return (
    <Modal open closeIcon size="small" onClose={() => toggleModal(false, index)} closeOnDimmerClick={false}>
      <Modal.Header className="center-align signup-header">
        <Header as="h3">Add new content block</Header>
      </Modal.Header>
      {
        <Modal.Content className="signup-content">
          <Form>
            <Form.Group widths={2}>
              {smartElement.Input('title', { multiForm: [metaInfo.form, 'content', index] })}
              {smartElement.FormSelect('scope', { multiForm: [metaInfo.form, 'content', index] })}
              {smartElement.FormSelect('contentType', { multiForm: [metaInfo.form, 'content', index] })}
            </Form.Group>
            <Divider hidden />
          </Form>
          <div className="center-align">
            <Button disabled={!COLLECTION_CONTENT_FRM.meta.isValid} loading={inProgress} primary content="Save" onClick={() => handleFormSubmit()} />
            <Button content="Close" onClick={() => toggleModal(false, index)} />
          </div>
        </Modal.Content>
      }
    </Modal>
  );
}

export default inject('collectionStore', 'uiStore')(formHOC(NewContentModal, metaInfo));
