import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Modal, Header, Button } from 'semantic-ui-react';
import { authActions } from './../../../services/actions';

@inject('authStore', 'uiStore')
@observer
export default class ChangePassword extends React.Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
    this.props.authStore.reset();
  }

  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleVerifyChange = e => this.props.authStore.setVerify(e.target.value);
  handleClick = (e) => {
    e.preventDefault();
    authActions.changePassword()
      .then(() => {
        this.props.history.push('/auth/login');
      });
  }
  render() {
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.history.push('/')}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Change Password for</Header>
          <p>{(this.props.authStore.values.email) ? this.props.authStore.values.email.value : ''}</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <Form onSubmit={this.handleSubmitForm}>
            <Form.Input
              fluid
              icon={{ className: 'ns-lock' }}
              iconPosition="left"
              type="password"
              placeholder="New Password"
              onChange={this.handlePasswordChange}
            />
            <Form.Input
              fluid
              icon={{ className: 'ns-lock' }}
              iconPosition="left"
              type="password"
              placeholder="Confirm Password"
              onChange={this.handleVerifyChange}
            />
            <Button fluid primary onClick={this.handleClick}>Change Password</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
