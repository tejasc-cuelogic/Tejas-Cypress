import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Divider } from 'semantic-ui-react';
import authActions from '../../actions/auth';

import ListErrors from '../../theme/common/ListErrors';
import FieldError from '../../theme/common/FieldError';
import validationActions from '../../actions/validation';

@inject('authStore', 'uiStore')
@observer
export default class ForgotPassword extends React.Component {
  componentWillMount() {
    this.props.authStore.reset();
  }

  componentWillUnmount() {
    // Do not reset authStore values from here as some of those are required while changing password
    // this.props.authStore.reset();
    // authStore will reset after flow gets completed with success or error
    this.props.uiStore.reset();
  }

  handleInputChange = (e, { name, value }) => validationActions.validateRegisterField(name, value);
  handleSubmitForm = (event) => {
    event.preventDefault();
    authActions.resetPassword()
      .then(() => this.props.history.push('/reset-password'));
  }

  render() {
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;
    return (
      <div className="ui vertical segment content">
        <div className="ui container">
          <div className="login-form">
            <Header as="h1" textAlign="center">Need a link to reset your password?</Header>
            <Grid
              textAlign="center"
              verticalAlign="middle"
            >
              <Grid.Column>
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
                      error={!!values.email.error}
                    />
                    <FieldError error={values.email.error} />
                    <Button
                      fluid
                      primary
                      size="large"
                      disabled={this.props.authStore.canSendMail}
                    >
                      Continue
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
        </div>
      </div>
    );
  }
}
