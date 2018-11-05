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
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Do you want to save your progress?</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Form error onSubmit={this.props.partialSave}>
            <div className="center-align">
              <Button.Group vertical>
                <Button className="very relaxed" loading={inProgress} color="green">Yes, save it</Button>
                <Button inverted onClick={this.handleCloseModal} color="green" >No, thank you</Button>
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
