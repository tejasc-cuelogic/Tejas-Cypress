import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { ListErrors } from '../../../../../../theme/shared';

@inject('uiStore')
@withRouter
@observer
export default class CancelInvestment extends Component {
  componentWillMount() {
  }

  submit = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.setShareModalData(true);
    const location = `${this.props.refLink}/preview`;
    this.props.history.push(location);
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    const { inProgress, errors } = this.props.uiStore;
    // const { } = this.props.beneficiaryStore;
    return (
      <Modal size="small" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Do you want to cancel this investment?</Header>
          <Divider />
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Form error onSubmit={this.submit}>
            <div className="center-align mt-30">
              <Button color="red" >Yes, cancel investment</Button>
              <Button loading={inProgress} color="green">No, keep investment</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
