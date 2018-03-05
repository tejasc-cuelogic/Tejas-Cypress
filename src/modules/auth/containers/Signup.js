import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Grid, Header, Form, Divider } from 'semantic-ui-react';

class Signup extends Component {
  render() {
    return (
      <div className="ui vertical segment content banner-img">
        <div className="ui container">
          {/* Login modal */}
          <Modal size="tiny" trigger={<Button>Login</Button>}>
            <Modal.Content className="login-modal">
              <Grid textAlign="center">
                <Grid.Column>
                  <Header as="h2">Log in to NextSeed</Header>
                  <Form>
                    <div stacked>
                      <Button color="facebook" size="large" fluid>
                        Log in with Facebook
                      </Button>
                    </div>
                  </Form>
                  <Divider horizontal section>Or</Divider>
                  <Form error onSubmit={this.handleSubmitForm}>
                    <div stacked>
                      <Form.Input
                        fluid
                        label="E-mail"
                        className="left-align"
                        placeholder="E-mail address"
                        name="email"
                        // value={values.email.value}
                        onChange={this.handleInputChange}
                      />
                      <Form.Input
                        fluid
                        label="Password"
                        className="left-align"
                        placeholder="Password"
                        type="password"
                        name="password"
                        // value={values.password.value}
                        onChange={this.handleInputChange}
                      />
                      <Button circular color="green" size="large">Log in</Button>
                    </div>
                  </Form>
                </Grid.Column>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              <p className="pull-left"><Link to="forgot-password">Forgot Password?</Link></p>
              <p>Dont have an account? <Link to="register">Sign up</Link></p>
            </Modal.Actions>
          </Modal>
          {/* Register modal */}
          <Modal size="tiny" trigger={<Button>Sign up</Button>}>
            <Modal.Header>Profile Picture</Modal.Header>
            <Modal.Content scrolling>
              <Modal.Description>
                <Header>Modal Header</Header>
                <p>This is an example of expanded content cause the modals dimmer to scroll</p>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button primary>Proceed</Button>
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Signup;
