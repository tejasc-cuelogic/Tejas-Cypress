import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react';

import ListErrors from '../../components/common/ListErrors';

@inject('authStore')
@observer
export default class ResetPassword extends React.Component {
  componentWillUnmount() {
    if (this.props.uiStore) {
      this.props.uiStore.clearErrors();
    }
  }

  handlePasswordChange = event => this.props.authStore.setPassword(event.target.value);
  handleVerifyChange = event => this.props.authStore.setVerify(event.target.value);
  handleCodeChange = event => this.props.authStore.setCode(event.target.value);
  handleSubmitForm = (event) => {
    event.preventDefault();
    this.props.authStore.setNewPassword().then(() => this.props.history.push('/login'));
  }

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="login-form">
        <Header as="h1" textAlign="center">Reset Password</Header>
        <p className="note">The verification code has been sent to your registered email address</p>
        <Grid
          textAlign="center"
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form error onSubmit={this.handleSubmitForm}>
              <div stacked>
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  placeholder="New Password"
                  value={values.password}
                  onChange={this.handlePasswordChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  placeholder="Verify Password"
                  value={values.verify}
                  onChange={this.handleVerifyChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Verification Code"
                  value={values.verificationCode}
                  onChange={this.handleCodeChange}
                />
                {errors &&
                  <Message error textAlign="left">
                    <ListErrors errors={errors} />
                  </Message>
                }
                <Button
                  fluid
                  color="green"
                  disabled={inProgress}
                >
                  Reset Password
                </Button>
              </div>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
