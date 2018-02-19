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

  handleInputChange = (e, { name, value }) => this.props.authStore.setValue(name, value);
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
        <Grid
          textAlign="center"
          verticalAlign="middle"
        >
          <Grid.Column>
            <Header as="h1" textAlign="center">Sign in to invest today or access your business application</Header>
            <Form size="large">
              <div stacked>
                <Button color="facebook" size="large" fluid>
                  <Icon name="facebook" /> LOG IN WITH FACEBOOK
                </Button>
              </div>
            </Form>
            <Divider horizontal>Or</Divider>
            <Form size="large" error onSubmit={this.handleSubmitForm}>
              <div stacked>
                <Form.Input
                  fluid
                  icon="envelope"
                  iconPosition="left"
                  placeholder="E-mail address"
                  name="email"
                  value={values.email.value}
                  onChange={this.handleInputChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={values.password.value}
                  onChange={this.handleInputChange}
                />
                <Button
                  fluid
                  color="green"
                  size="large"
                  disabled={inProgress}
                >
                  LOG IN WITH EMAIL
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
