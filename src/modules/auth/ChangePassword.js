import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Grid, Header, Button } from 'semantic-ui-react';

import authActions from './../../actions/auth';

@inject('authStore', 'uiStore')
@observer
export default class ChangePassword extends React.Component {
  componentWillUnmount() {
    this.props.authStore.reset();
    this.props.uiStore.clearErrors();
  }

  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleVerifyChange = e => this.props.authStore.setVerify(e.target.value);
  handleClick = (e) => {
    e.preventDefault();
    authActions.changePassword()
      .then(() => {
        this.props.history.push('/');
      });
  }
  render() {
    return (
      <div className="login-form">
        <Header as="h1" textAlign="center">
          Change Password for <br />
          <span> {(this.props.authStore.values.email) ? this.props.authStore.values.email.value : ''}</span>
        </Header>
        <Grid
          textAlign="center"
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form>
              <div stacked>
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  placeholder="New Password"
                  onChange={this.handlePasswordChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={this.handleVerifyChange}
                />
                <Button
                  fluid
                  primary
                  onClick={this.handleClick}
                >
                  Change Password
                </Button>
              </div>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
