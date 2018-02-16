import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Icon, Divider } from 'semantic-ui-react';
import authActions from './../../actions/auth';
import ListErrors from '../../components/common/ListErrors';


@inject('authStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class Login extends React.Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleEmailChange = e => this.props.authStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.login(this.props.authStore.values)
      .then(() => {
        if (this.props.authStore.newPasswordRequired) {
          this.props.history.push('/change-password');
        } else {
          this.props.authStore.reset();
          this.props.history.replace('/app/dashboard');
        }
      });
  };

  render() {
    const { values, inProgress } = this.props.authStore;
    const { errors } = this.props.uiStore;

    return (
      <div className="login-form">
        <Header as="h1" textAlign="center">Sign in to invest today or access your business application</Header>
        <Grid
          textAlign="center"
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form>
              <div stacked="true">
                <Button color="facebook" fluid>
                  <Icon name="facebook" /> Log in with Facebook
                </Button>
              </div>
            </Form>
            <Divider horizontal>Or</Divider>
            <Form error onSubmit={this.handleSubmitForm}>
              <div stacked>
                <Form.Input
                  fluid
                  icon="envelope"
                  iconPosition="left"
                  placeholder="E-mail address"
                  value={values.email}
                  onChange={this.handleEmailChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  value={values.password}
                  onChange={this.handlePasswordChange}
                />
                <Button
                  fluid
                  color="green"
                  disabled={inProgress}
                >
                  Log in with Email
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
              <p><Link to="forgot-password">Forgot Password?</Link></p>
              <p>New here? <Link to="register">Sign up</Link></p>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
