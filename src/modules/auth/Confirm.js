import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Divider } from 'semantic-ui-react';

import ListErrors from '../../components/common/ListErrors';
import authActions from './../../actions/auth';

@inject('authStore', 'uiStore')
@withRouter
@observer
export default class Confirm extends React.Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleCodeChange = e => this.props.authStore.setCode(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.confirmCode()
      .then(() => this.props.history.replace('/login'));
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="login-form">
        <Header as="h1" textAlign="center">Confirm verification code</Header>
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
                  value={values.email}
                  onChange={this.handleEmailChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Code"
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
                  Confirm
                </Button>
              </div>
            </Form>
            <Divider section />
            <Message>
              <p><Link to="login">Have an account?</Link></p>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
