import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';

import authActions from './../../../actions/auth';

@inject('authStore')
@observer
export default class ChangePassword extends React.Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleVerifyChange = e => this.props.authStore.setVerify(e.target.value);
  handleClick = (e) => {
    e.preventDefault();
    authActions.changePassword()
      .then(() => {
        this.props.history.push('/login');
      });
  }
  render() {
    return (
      <div>
        <h2>Change Password for</h2><p>{this.props.authStore.values.email}</p>
        <Form>
          <Form.Input
            label="New Password"
            type="password"
            onChange={this.handlePasswordChange}
          />
          <Form.Input
            label="Confirm Password"
            type="password"
            onChange={this.handleVerifyChange}
          />
          <Button onClick={this.handleClick}>Change Password</Button>
        </Form>
      </div>
    );
  }
}
