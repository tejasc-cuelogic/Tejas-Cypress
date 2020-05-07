import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Divider, Header, Modal, Button } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_CONTENT_FRM',
};

@inject('collectionStore', 'nsUiStore')
@withRouter
@observer
class NewContentModal extends React.Component {
  handleFormSubmit = async () => {
    const params = {
      keyName: false,
      forms: ['COLLECTION_CONTENT_FRM'],
    };
    const { reOrderHandle, COLLECTION_CONTENT_FRM, setFieldValue, upsertCollection } = this.props.collectionStore;
    await upsertCollection(params);
    reOrderHandle(COLLECTION_CONTENT_FRM.fields.content);
    this.props.collectionStore.setFormData('HEADER_META_FRM');
    setFieldValue('newContentModal', false);
    this.props.history.push(`${this.props.refLink}/${this.props.index + 1}`);
  }

  render() {
    const { smartElement, index, nsUiStore, collectionStore, toggleModal } = this.props;
    const { loadingArray } = nsUiStore;
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
              <Button disabled={!COLLECTION_CONTENT_FRM.meta.isValid} loading={loadingArray.includes('adminCollectionUpsert')} primary content="Save" onClick={() => this.handleFormSubmit()} />
              <Button content="Close" onClick={() => toggleModal(false, index)} />
            </div>
          </Modal.Content>
        }
      </Modal>
    );
  }
}

export default formHOC(NewContentModal, metaInfo);
