import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Divider, Header, Modal, Button } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_CONTENT_FRM',
};

@inject('collectionStore', 'uiStore')
@withRouter
@observer
class NewContentModal extends Component {
  handleFormSubmit = () => {
    const params = {
      keyName: false,
      forms: ['COLLECTION_CONTENT_FRM'],
    };
    this.props.collectionStore.reOrderHandle(this.props.collectionStore.COLLECTION_CONTENT_FRM.fields.content);
    this.props.collectionStore.updateCollection(params).then(() => {
      this.props.history.push(`${this.props.refLink}/${this.props.index + 1}`);
    });
  }

  render() {
    const { smartElement, index, toggleModal, uiStore, collectionStore } = this.props;
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
              <Button disabled={!COLLECTION_CONTENT_FRM.meta.isValid} loading={inProgress} primary content="Save" onClick={this.handleFormSubmit} />
              <Button content="Close" onClick={() => toggleModal(false, index)} />
            </div>
          </Modal.Content>
        }
      </Modal>
    );
  }
}

export default formHOC(NewContentModal, metaInfo);
