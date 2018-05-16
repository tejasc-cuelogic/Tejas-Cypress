import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Icon, Divider } from 'semantic-ui-react';
import authActions from './../../actions/auth';
import ListErrors from '../../theme/common/ListErrors';

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
    authActions.login()
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
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;

    return (
      <div className="ui vertical segment content">
        <div className="ui container">
          <div className="login-form">
            <Header as="h1" textAlign="center">Sign in to invest today or access your business application</Header>
            <Grid
              textAlign="center"
              verticalAlign="middle"
            >
              <Grid.Column>
                <Form>
                  <div stacked>
                    <Button color="facebook" fluid>
                      <Icon className="ns-facebook" /> LOG IN WITH FACEBOOK
                    </Button>
                  </div>
                </Form>
                <Divider horizontal>Or</Divider>
                <Form error onSubmit={this.handleSubmitForm}>
                  <div stacked>
                    <Form.Input
                      fluid
                      icon={{ className: 'ns-envelope' }}
                      iconPosition="left"
                      placeholder="E-mail address"
                      name="email"
                      value={values.email.value}
                      onChange={this.handleInputChange}
                    />
                    <Form.Input
                      fluid
                      icon={{ className: 'ns-lock' }}
                      iconPosition="left"
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={values.password.value}
                      onChange={this.handleInputChange}
                    />
                    <Button
                      fluid
                      primary
                      size="large"
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
        </div>
      </div>
    );
  }
}
