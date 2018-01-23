import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';

import adminActions from '../../../../actions/admin';

@inject('adminStore', 'userStore')
@observer
export default class UserNew extends React.Component {
  handleGivenNameChange = e => this.props.userStore.setGivenName(e.target.value);
  handleFamilyNameChange = e => this.props.userStore.setFamilyName(e.target.value);
  handleEmailChange = e => this.props.userStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.userStore.setPassword(e.target.value);
  handleCheckboxChange = (e) => {
    if (e.target.checked) {
      this.props.userStore.addRole(e.target.value);
    } else {
      this.props.userStore.removeRole(e.target.value);
    }
  }
  handleClick = (e) => {
    e.preventDefault();
    adminActions.createNewUser()
      .then(() => {
        this.props.history.push('/admin/users');
      });
  }

  render() {
    return (
      <div>
        <h2>Create New User</h2>
        <Form>
          <Form.Input
            placeholder="First Name"
            label="First Name"
            onChange={this.handleGivenNameChange}
            width={10}
          />
          <Form.Input
            placeholder="Last Name"
            label="Last Name"
            onChange={this.handleFamilyNameChange}
            width={10}
          />
          <Form.Input
            placeholder="Email"
            label="Email"
            onChange={this.handleEmailChange}
            width={10}
          />
          <Form.Input
            placeholder="Temporary Passowrd"
            label="Temporary Passowrd"
            value={this.props.userStore.newUser.password}
            onChange={this.handlePasswordChange}
            width={10}
          />
          <Form.Field
            type="checkbox"
            control="input"
            label="Admin"
            value="admin"
            width={3}
            onChange={this.handleCheckboxChange}
          />
          <Form.Field
            type="checkbox"
            control="input"
            label="Business Owner"
            value="bowner"
            width={3}
            onChange={this.handleCheckboxChange}
          />
          <Form.Field
            type="checkbox"
            control="input"
            label="Investor"
            value="investor"
            width={3}
            onChange={this.handleCheckboxChange}
          />
          <Button
            disabled={!this.props.userStore.canSubmit}
            onClick={this.handleClick}
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
