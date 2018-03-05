import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Grid, Header, Form, Divider } from 'semantic-ui-react';

class Signup extends Component {
  render() {
    return (
      // <div className="ui one column grid">
      //   <div className="column nsContent">
      //     <div>
      //       <span className="title">Signup</span>
      //       <p className="pageContent">
      //         If you have questions, please don’t hesitate to contact us at
      //         &nbsp;<a href="mailto:info@nextseed.com">info@nextseed.com</a>
      //       </p>
      //     </div>
      //   </div>
      // </div>
      <div>
        {/* Login modal */}
        <Modal size="mini" trigger={<Button>Login</Button>}>
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
                <Divider horizontal>Or</Divider>
                <Form error onSubmit={this.handleSubmitForm}>
                  <div stacked>
                    <Form.Input
                      fluid
                      icon="envelope"
                      iconPosition="left"
                      placeholder="E-mail address"
                      name="email"
                      // value={values.email.value}
                      onChange={this.handleInputChange}
                    />
                    <Form.Input
                      fluid
                      icon="lock"
                      iconPosition="left"
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
            <p>New here? <Link to="register">Sign up</Link></p>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default Signup;
