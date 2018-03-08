import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react';

import ListErrors from '../../components/common/ListErrors';
import FieldError from '../../components/common/FieldError';
import authActions from './../../actions/auth';
import validationActions from './../../actions/validation';

@inject('authStore', 'uiStore')
@withRouter
@observer
export default class Confirm extends React.Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleCodeChange = (e, { name, value }) => validationActions.validateRegisterField(name, value);
  handleEmailChange = (e, { name, value }) => validationActions.validateRegisterField(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.confirmCode()
      .then(() => this.props.history.replace('/login'));
  };

  render() {
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;
    return (
      <div className="login-form">
        <Header as="h1" textAlign="center">Confirm Account</Header>
        <Grid
          textAlign="center"
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form error onSubmit={this.handleSubmitForm}>
              <div stacked>
                <Form.Input
                  fluid
                  icon="envelope"
                  iconPosition="left"
                  placeholder="E-mail address"
                  name="email"
                  value={values.email.value}
                  onChange={this.handleEmailChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Verification Code"
                  name="code"
                  value={values.code.value}
                  onChange={this.handleCodeChange}
                  error={!!values.code.error}
                />
                <FieldError error={values.code.error} />
                <Button
                  fluid
                  color="green"
                  disabled={this.props.authStore.canConfirm}
                >
                  Confirm!
                </Button>
                {errors &&
                  <Message error textAlign="left">
                    <ListErrors errors={[errors.message]} />
                  </Message>
                }
              </div>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
