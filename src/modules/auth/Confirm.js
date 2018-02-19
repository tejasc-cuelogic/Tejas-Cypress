import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Message, Form, Button, Grid, Header } from 'semantic-ui-react';

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
        <Grid
          textAlign="center"
          verticalAlign="middle"
        >
          <Grid.Column>
            <Header as="h1" textAlign="center">Confirm Account</Header>
            <Form size="large" error onSubmit={this.handleSubmitForm}>
              <Form.Input
                fluid
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
                size="large"
                disabled={this.props.authStore.canConfirm}
              >
                Confirm!
              </Button>
              {errors &&
                <Message error textAlign="left">
                  <ListErrors errors={[errors.message]} />
                </Message>
              }
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
