import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form, Message } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';

@inject('uiStore')
@withRouter
@observer
export default class DeleteAppModal extends Component {
  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.uiStore.setErrors(null);
    this.props.history.goBack();
  }

  render() {
    const fields = {
      comments: {
        value: '', label: 'Please enter your comments here:', error: undefined, rule: 'required', placeHolder: 'Type your comment here...', customErrors: { required: 'required' },
      },
    };
    const { inProgress } = this.props.uiStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Delete Application?</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Form error onSubmit={this.props.submit}>
            <div className="field-wrap">
              <Form.Group widths="equal">
                <FormTextarea
                  type="text"
                  name="comments"
                  fielddata={fields.comments}
                />
              </Form.Group>
            </div>
            <div className="center-align">
              <Button.Group>
                <Button className="very relaxed" onClick={this.handleCloseModal} loading={inProgress} color="green">Promote</Button>
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
