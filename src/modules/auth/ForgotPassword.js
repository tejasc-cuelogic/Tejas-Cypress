import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Divider } from 'semantic-ui-react';
import authActions from '../../actions/auth';

import ListErrors from '../../components/common/ListErrors';

@inject('authStore', 'uiStore')
@observer
export default class ForgotPassword extends React.Component {
  componentWillUnmount() {
    // Do not reset authStore values from here as some of those are required while changing password
    // this.props.authStore.reset();
    // authStore will reset after flow gets completed with success or error
    this.props.uiStore.reset();
  }

  handleEmailChange = event => this.props.authStore.setEmail(event.target.value);
  handleSubmitForm = (event) => {
    event.preventDefault();
    authActions.resetPassword(this.props.authStore.values).then(() => this.props.history.push('/reset-password'));
  }

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
            <Header as="h1" textAlign="center">Need a link to reset your password?</Header>
            <Form size="large" error onSubmit={this.handleSubmitForm}>
              <div stacked>
                <Form.Input
                  fluid
                  icon="envelope"
                  iconPosition="left"
                  placeholder="E-mail address"
                  value={values.email}
                  onChange={this.handleEmailChange}
                />
                <Button
                  fluid
                  color="green"
                  size="large"
                  disabled={inProgress}
                >
                  Reset Password
                </Button>
                {errors &&
                  <Message error textAlign="left">
                    <ListErrors errors={errors ? [errors.message] : []} />
                  </Message>
                }
              </div>
            </Form>
            <Divider section />
            <Message>
              <p><Link to="login">Return to log In</Link></p>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
