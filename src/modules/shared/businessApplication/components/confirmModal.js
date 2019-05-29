import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Message } from 'semantic-ui-react';
import { ListErrors } from '../../../../theme/shared';

@inject('uiStore')
@withRouter
@observer
export default class ConfirmModal extends Component {
  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.uiStore.setErrors(null);
    this.props.history.goBack();
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Content className="center-align relaxed">
          <Header as="h3" className="mb-30">Do you want to save your progress?</Header>
          <Form error onSubmit={this.props.partialSave}>
            {errors &&
              <Message error className="mb-30">
                <ListErrors errors={[errors]} />
              </Message>
            }
            <Button.Group vertical>
              <Button primary className="very relaxed mb-10" content="Yes, save it" loading={inProgress} />
              <Button inverted color="green" content="No, thank you" onClick={this.handleCloseModal} />
            </Button.Group>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
