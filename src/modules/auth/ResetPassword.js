import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Message, Form, Grid, Header, Divider } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

import ListErrors from '../../components/common/ListErrors';
import FieldError from '../../components/common/FieldError';
import authActions from '../../actions/auth';
import validationActions from '../../actions/validation';

@inject('authStore', 'uiStore')
@withRouter
@observer
export default class ResetPassword extends React.Component {
  componentWillUnmount() {
    if (this.props.uiStore) {
      this.props.uiStore.clearErrors();
    }
  }

  handleInputChange = (e, { name, value }) => validationActions.validateRegisterField(name, value);
  handleSubmitForm = (event) => {
    event.preventDefault();
    authActions.setNewPassword().then(() => this.props.history.push('/login'));
  }

  render() {
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;

    return (
      <div className="ui vertical segment content">
        <div className="ui container">
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
                      placeholder="Password"
                      name="password"
                      type="password"
                      value={values.password.value}
                      onChange={this.handleInputChange}
                      error={!!values.password.error}
                    />
                    <FieldError error={values.password.error} />
                    <Form.Input
                      fluid
                      icon="lock"
                      iconPosition="left"
                      placeholder="Verify Password"
                      name="verify"
                      type="password"
                      value={values.verify.value}
                      onChange={this.handleInputChange}
                      error={!!values.verify.error}
                    />
                    <FieldError error={values.verify.error} />
                    <Form.Input
                      fluid
                      icon="lock"
                      iconPosition="left"
                      placeholder="Verification Code"
                      name="code"
                      value={values.code.value}
                      onChange={this.handleInputChange}
                      error={!!values.code.error}
                    />
                    <FieldError error={values.code.error} />
                    <Button
                      fluid
                      primary
                      disabled={!this.props.authStore.canRegister}
                    >
                      Reset Password
                    </Button>
                    {errors &&
                      <Message error textAlign="left">
                        <ListErrors errors={[errors.message]} />
                      </Message>
                    }
                  </div>
                </Form>
                <Divider section />
                <Message>
                  <p><Link to="login">Remembered password?</Link></p>
                </Message>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}
