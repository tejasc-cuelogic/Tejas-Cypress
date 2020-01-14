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
    this.props.manageOfferingStore.updateOffering(params).then(() => {
      this.props.history.push(`${this.props.refLink}/${this.props.index + 1}`);
    });
  }

  render() {
    const { smartElement, index, toggleModal, uiStore } = this.props;
    const { inProgress } = uiStore;
    return (
      <Modal open closeIcon size="small" onClose={() => toggleModal(false)} closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Add new component</Header>
        </Modal.Header>
        {
          <Modal.Content className="signup-content">
            <Form>
              <Form.Group widths={2}>
                {smartElement.Input('title', { multiForm: [metaInfo.form, 'content', index] })}
                {smartElement.Masked('order', { multiForm: [metaInfo.form, 'content', index] })}
                {smartElement.FormSelect('scope', { multiForm: [metaInfo.form, 'content', index] })}
                {smartElement.FormSelect('contentType', { multiForm: [metaInfo.form, 'content', index] })}
              </Form.Group>
              <Divider hidden />
            </Form>
            <div className="center-align">
              <Button loading={inProgress} primary content="Save" onClick={this.handleFormSubmit} />
              <Button content="Close" onClick={() => toggleModal(false)} />
            </div>
          </Modal.Content>
        }
      </Modal>
    );
  }
}

export default formHOC(NewContentModal, metaInfo);
