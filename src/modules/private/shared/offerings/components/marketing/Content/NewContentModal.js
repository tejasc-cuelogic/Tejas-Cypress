import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Divider, Header, Modal, Button } from 'semantic-ui-react';
import formHOC from '../../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'OFFERING_CONTENT_FRM',
};

@inject('manageOfferingStore', 'uiStore')
@withRouter
@observer
class NewContentModal extends Component {
  handleFormSubmit = () => {
    const params = {
      keyName: false,
      forms: ['OFFERING_CONTENT_FRM'],
    };
    this.props.manageOfferingStore.reOrderHandle(this.props.manageOfferingStore.OFFERING_CONTENT_FRM.fields.content);
    this.props.manageOfferingStore.updateOffering(params).then(() => {
      this.props.history.push(`${this.props.refLink}/${this.props.index + 1}`);
    });
  }

  render() {
    const { smartElement, index, toggleModal, uiStore, manageOfferingStore } = this.props;
    const { inProgress } = uiStore;
    const { OFFERING_CONTENT_FRM } = manageOfferingStore;
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
              <Button disabled={!OFFERING_CONTENT_FRM.meta.isValid} loading={inProgress} primary content="Save" onClick={this.handleFormSubmit} />
              <Button content="Close" onClick={() => toggleModal(false, index)} />
            </div>
          </Modal.Content>
        }
      </Modal>
    );
  }
}

export default formHOC(NewContentModal, metaInfo);
