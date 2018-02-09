import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Divider } from 'semantic-ui-react';

import ListErrors from '../../components/common/ListErrors';

@inject('authStore', 'uiStore')
@observer
export default class ForgotPassword extends React.Component {
  componentWillMount() {
    if (this.props.authStore.errors) {
      this.props.authStore.clearErrors();
    }
  }

  handleEmailChange = event => this.props.authStore.setEmail(event.target.value);
  handleSubmitForm = (event) => {
    event.preventDefault();
    this.props.authStore.resetPassword().then(() => this.props.history.push('/reset-password'));
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
                {errors &&
                  <Message error textAlign="left">
                    <ListErrors errors={errors ? [errors.message] : []} />
                  </Message>
                }
                <Button
                  fluid
                  color="green"
                  size="large"
                  disabled={inProgress}
                >
                  Reset Password
                </Button>
              </div>
            </Form>
            <Divider section />
            <Message>
              <p><Link to="login">Just kidding, I remembered</Link></p>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
