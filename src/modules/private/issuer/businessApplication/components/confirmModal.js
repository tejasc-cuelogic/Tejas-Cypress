import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import Aux from 'react-aux';
import { Modal, Button, Header, Form } from 'semantic-ui-react';
// import { ListErrors } from '../../../../../theme/shared';
// import { Helper } from '../../../../../helper/utility';

@inject('newBusinessStore', 'uiStore')
@withRouter
@observer
export default class ConfirmModal extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.newBusinessStore.businessAppParitalSubmit().then(() => {
    //   Helper.toast('Business application saved!', 'success');
    //   this.props.history.push('/app/dashboard');
    });
    // const location = `${this.props.refLink}/preview`;
    // this.props.history.push(location);
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    const { inProgress } = this.props.uiStore;
    // const {     // } = this.props.newBusinessStore;
    // const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Do you want to save your progress?</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {/* {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          } */}
          <Form error onSubmit={this.submit}>
            <div className="center-align mt-30">
              <Button inverted onClick={this.handleCloseModal} color="green" >Cancel</Button>
              <Button loading={inProgress} color="green">Proceed</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
